import BaseModel from './base.mjs';

export class EntityModel extends BaseModel {
    constructor(entity) {
        super();
        this.sufix = 'Entity';
        this.name = this._validate(entity, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
    
    static from(value) {
        if(!value)
            return [];
        
        if (typeof value === 'string' && value.includes(','))
            return value.split(',').map(x => new EntityModel(x));

        return [new EntityModel(value)];
    }
}