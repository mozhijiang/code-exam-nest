import { Body, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ListQuery, ServiceInteface } from "./base.service";

export class BaseContriller<E, C, U>{
    constructor(private readonly baseService: ServiceInteface<E, C, U>) {
    }
    @Post()
    create(@Body() createDto: C) {
        return this.baseService.save(createDto);
    }
    @Get('all')
    all() {
        return this.baseService.all();
    }
    @Get()
    list(@Query() query: ListQuery) {
        return this.baseService.list(query);
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.baseService.findOne(+id);
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