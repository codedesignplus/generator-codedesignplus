import BaseModel from "./base.mjs";

export class AggregateModel extends BaseModel {
    constructor(aggregate) {
        super();

        this.sufix = 'Aggregate';
        this.name = this._validate(aggregate, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }

    static from(value) {
        return new AggregateModel(value);
    }
}