import { toPascalCase, BaseModel } from "./base.mjs";

export class DataTransferObjectModel extends BaseModel {
    constructor(dto) {
        super();

        this.sufix = 'Dto';
        this.name = this._validate(dto, "(Dto|DataTransferObject)");
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }

    static from(value) {
        if (!value)
            return null;

        return new DataTransferObjectModel(toPascalCase(value));
    }
}