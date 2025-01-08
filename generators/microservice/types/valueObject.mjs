import { toPascalCase, BaseModel } from "./base.mjs";

export class ValueObjectModel  extends BaseModel {
    constructor(valueObject) {

        super();

        this.sufix = '';
        this.name = this._validate(valueObject, "(Vo|ValueObject)");
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
    
    static from(value) {
        if(!value)
            return [];

        if (typeof value === 'string' && value.includes(','))
            return value.split(',').map(x => new ValueObjectModel(toPascalCase(x)));

        return [new ValueObjectModel(toPascalCase(value))];
    }
}