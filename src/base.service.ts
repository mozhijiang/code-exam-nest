import { HttpException, Logger } from "@nestjs/common";
import { DeepPartial, Equal, FindManyOptions, Like, MoreThan, Repository } from "typeorm";
import { inspect } from "util";
interface ListQuery {
    page: number,
    size: number,
    [key: string]: any
}
interface BaseParam {
    primaryKey: string,
    baseRelations?: string[]
}
declare class ServiceInteface<E, C, U>{
    save(entity: C | U): Promise<E>;
    list(query: ListQuery, relations?: string[], where?: object | Array<object>, optionsHandle?: (options: FindManyOptions<E>) => FindManyOptions<E>): Promise<[E[], number]>;
    find(optionsHandle?: (options: FindManyOptions<E>) => FindManyOptions<E>): Promise<E[]>;
    findOne(id: number, relations?: string[]): Promise<E>;
    update(id: number, update: U): Promise<E>;
    remove(id: number): Promise<E>;
    all: (relations: string[]) => Promise<E[]>
};
class BaseService<E, C, U> {
    public logger: Logger = new Logger('BaseService', { timestamp: true });
    constructor(public repository: Repository<E>, public param: BaseParam) {
    }
    /**
       * 保存
       * 保存之前会调用create已触发@BeforeInsert和BeforeUpdate
       * @param create create dto
    */
    async save(create: C): Promise<E> {
        this.logger.log(`${this.constructor.name}.save`);
        const created: E = this.repository.create(create as unknown as DeepPartial<E>);
        return this.repository.save(created, { chunk: 100 });
    }
    /**
     * findAndCount
     * 支持关键字搜索 ?key={:key} 搜索时需要制定columns, columns会自动处理成where条件且自动加入查询关系
     * 同时使用where 和 搜索是，会自动合并where
     * 支持指定查询关系
     * @param query 前台query参数
     * @param relations 引用关系
     * @param where 附加where条件
     */
    async list(
        query: ListQuery,
        relations?: string[],
        where?: object | Array<object>,
        optionsHandle?: (options: FindManyOptions<E>) => FindManyOptions<E>,
    ): Promise<[E[], number]> {
        this.logger.log(`${this.constructor.name}.list`);
        // 补充默认的分页参数 ?page=1&size=20
        let options = this.listOptions(query, relations, where);
        if (optionsHandle) options = optionsHandle(options);
        // 执行查询
        console.log(options)
        return this.repository.findAndCount(options);
    }
    /**
     * find
     * 使用where自定义查询，当前的实现未处理where和relations校验 、select和metadata冲突
     * @param where 查询条件
     * @param relations 需要查询的引用
     * @param select 需要查询的元数据
     */
    async find(
        optionsHandle?: (options: FindManyOptions<E>) => FindManyOptions<E>,
    ): Promise<E[]> {
        this.logger.log(`${this.constructor.name}.find`);
        let options: FindManyOptions<E> = {};
        if (optionsHandle) options = optionsHandle(options);
        return this.repository.find(options);
    }
    /**
     * 指定id查询
     * @param id 查询的目标id
     * @param relations 查询的引用关系
     */
    async findOne(id: number, relations?: string[]): Promise<E> {
        this.logger.log(`${this.constructor.name}.findOne`);
        if (typeof +id != 'number') throw new HttpException('查询参数错误', 500);
        const options = {};
        if ((relations || []).length) options['relations'] = this.getRelations(relations.join(';'));
        const found = await this.repository.findOne(id, options);
        if (!found) throw new HttpException('查询失败，没有有效的数据', 500);
        return found;
    }
    async all(relations?: []) {
        this.logger.log(`${this.constructor.name}.all`);
        return this.repository.find({
            where: {
                [this.param.primaryKey]: MoreThan(0),
            },
            relations: relations || []
        });
    }
    /**
   * 更新数据
   * @param id 数字Id
   * @param update 欲更新后的结果，不需要更新的字段请不要使用null，而是直接delete对应的key
   */
    async update(id: number, update: U): Promise<E> {
        this.logger.log(`${this.constructor.name}.update`);
        const found = await this.findOne(id);
        const merged = this.repository.merge(found, update as unknown as DeepPartial<E>);
        const created = this.repository.create(merged);
        return this.repository.save(created);
    }
    /**
     * 删除指定id的数据
     * @param id
     */
    async remove(id: number): Promise<E> {
        this.logger.log(`${this.constructor.name}.remove`);
        const found = await this.findOne(id);
        return this.repository.remove(found);
    }

    /**
     * 生成排序规则
     * @param orders 多个排序使用;分割，每个排序使用 column,‘ASC|DESC’ 样式
     */
    getOrder(orders: string): any {
        return orders.split(';').reduce((o, i) => {
            const data = i.split(',');
            //TODO 需要验证排序是否是DESC/ASC
            o[data[0]] = data[1].toUpperCase() || 'ASC';
            return o;
        }, {});
    }
    listOptions(query: ListQuery, relations?: string[], where?: object | Array<object>) {
        const { page = 1, size = 20, ...queries } = query;
        const options: any = {};
        // 构造分页选项
        options['skip'] = (page - 1 < 0 ? 0 : page - 1) * size;
        options['take'] = size;
        // 排序 &order=id,asc;name,desc;age,1;weight,-1
        if (queries.order) {
            options['order'] = this.getOrder(queries.order);
        }
        const identifier = this.getIdentifier(queries.columns, queries);

        // 计算where
        if (queries.columns && queries.key) {
            if (!relations) relations = [];
            options['where'] = this.getConditional(queries.key, queries.columns, relations);
            options['where'].forEach((_whereItem, index) => {
                for (const identKey in identifier) {
                    if (options['where'][index][identKey]) {
                        delete options['where'][index]; //传了ident列删除这个relation where
                    } else {
                        options['where'][index][identKey] = identifier[identKey];
                    }
                }
            });
            options['where'] = options['where'].filter((item) => item); //筛选掉空的where
            // console.log(options.where);
        } else if (Object.keys(identifier)?.length) {
            options.where = identifier;
            // console.log(options.where);
        }
        // 已计算where
        if (options.where) {
            this.logger.log(`搜索查询条件 ${inspect(options.where, { depth: 3, breakLength: Infinity })}`);
            if (where) {
                this.logger.log(`追加查询条件 ${inspect(where, { depth: 3, breakLength: Infinity })}`);
                if (where instanceof Array) {
                    // 如果追加的where是数组
                    options.where = where.concat(options.where);
                } else {
                    // 如果追加的where不是数组
                    options.where = options.where.map((w) => Object.assign(w, where));
                }
            }
        } else if (where) {
            options['where'] = where;
        }
        if (options['where']) {
            this.logger.log(`执行查询条件 ${inspect(options['where'], { depth: 3, breakLength: Infinity })}`);
        }
        // 校验并优化查询关系
        if (relations) {
            options['relations'] = this.getRelations(relations.join(';'));
        }
        return options as FindManyOptions<E>;
    }
    getIdentifier(columns: string, queries: object) {
        if (!columns) return {};
        return columns.split(',').reduce((conditions, column) => {
            const identKey = 'ident-' + column;
            if (queries[identKey] && Number.isInteger(+queries[identKey])) {
                const nests = column.split('-');
                const condition = nests.reverse().reduce((data, input, index) => {
                    index == 0
                        ? (data[input] = Equal(+queries[identKey]))
                        : (data[input] = { [nests[index - 1]]: data[nests[index - 1]] });
                    if (index > 0) {
                        delete data[nests[index - 1]];
                    }
                    return data;
                }, {});
                const conditionKey = column.split('-')[0];
                conditions[conditionKey] = condition[conditionKey];
            }
            return conditions;
        }, {});
    }
    /**
   * 根据想要搜索的key、数据列、引用关系生成where条件
   * @param key 搜索关键字
   * @param columns 关键字模糊匹配的数据列
   * @param relations 填充引用关系，避免find失败
   */
    getConditional(key: string, columns: string, relations: string[]): any[] {
        return columns.split(',').reduce((conditions, column) => {
            const nests = column.split('-');
            nests.forEach((it, index) => {
                if (index > 0) {
                    const relation = nests.slice(0, index).join('.');
                    if (!relations.includes(relation)) relations.concat(relation);
                }
            });
            const condition = nests.reverse().reduce((data, input, index) => {
                index == 0
                    ? (data[input] = Like('%' + key + '%'))
                    : (data[input] = { [nests[index - 1]]: data[nests[index - 1]] });
                if (index > 0) {
                    delete data[nests[index - 1]];
                }
                return data;
            }, {});
            return conditions.concat(condition);
        }, []);
    }
    /**
 * 校验引用关系
 * @param input 输入的引用关系，每个关系使用;分割
 */
    getRelations(input: string): string[] {
        let relations = input.split(';');
        relations = [...new Set(relations)];
        // 直接关系
        const directRelations = relations.filter((it) => !it.includes('.'));
        // 间接关系,用.分割
        const indirectRelations = relations.filter((it) => it.includes('.'));
        // 当前实体的实际拥有的关系
        const currentRelations = this.repository.metadata.relations;
        directRelations.forEach((it) => {
            if (!currentRelations.map((it) => it.propertyName).includes(it)) {
                this.logger.log(`移除无效的关系条件 ${inspect(it)}`);
                relations.splice(relations.indexOf(it), 1);
            }
        });
        indirectRelations.filter((it) => {
            if (relations.indexOf(it.slice(0, it.lastIndexOf('.'))) < 0) {
                relations.splice(relations.indexOf(it), 1);
                this.logger.log(`移除没有前置关系的条件 ${inspect(it)}`);
            }
            //将用户输入转换成字符串数组
            const nestedRelations = it.split('.');
            // 第一层数据关系
            let tempRelations = currentRelations;
            // 循环用户输入，逐个关系比对
            for (let i = 0; i < nestedRelations.length; i++) {
                // 当前层级关系的属性名数组
                const currents = tempRelations.map((relation) => relation.propertyName);
                // 当前用户输入的目标关系不在当前层级的关系中
                if (!currents.includes(nestedRelations[i]) && relations.includes(it)) {
                    this.logger.log(`移除无效的嵌套关系条件 ${inspect(it)}`);
                    relations.splice(relations.indexOf(it), 1);
                }
                // 更新到下一层
                tempRelations = tempRelations
                    .filter((rm) => rm.propertyName == nestedRelations[i])
                    .flatMap((rm) =>
                        rm.isTreeChildren || rm.isOneToMany || rm.isManyToMany
                            ? rm.inverseEntityMetadata
                            : rm.joinColumns
                                .filter((c) => c.propertyName == nestedRelations[i])
                                .flatMap((cm) => cm.relationMetadata.inverseEntityMetadata),
                    )
                    .flatMap((em) => em.relations);
            }
        });
        return relations;
    }
}
export {
    ServiceInteface, BaseService, ListQuery, BaseParam
};