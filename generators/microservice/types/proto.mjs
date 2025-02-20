import { toPascalCase, BaseModel } from "./base.mjs";

export class ProtoModel extends BaseModel {
    constructor(proto) {
        super();

        this.sufix = '';
        this.name = this._validate(proto, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.proto`.toLowerCase();
    }

    static from(value) {
        if (!value)
            return null;
        
        return new ProtoModel(toPascalCase(value));
    }
}