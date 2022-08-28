import { Body, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { BaseParam, ListQuery, ServiceInteface } from "./base.service";

export class BaseContriller<E, C, U>{
    constructor(private readonly baseService: ServiceInteface<E, C, U>, public param: BaseParam) {
    }
    @Post()
    create(@Body() createDto: C) {
        return this.baseService.save(createDto);
    }
    @Get('all')
    all() {
        return this.baseService.all(this.param.baseRelations || []);
    }
    @Get()
    list(@Query() query: ListQuery) {
        return this.baseService.list(query, this.param.baseRelations || []);
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.baseService.findOne(+id, this.param.baseRelations || []);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: U) {
        return this.baseService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.baseService.remove(+id);
    }
}