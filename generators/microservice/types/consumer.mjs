import BaseModel from "./base.mjs";

export class ConsumerModel extends BaseModel {
    constructor(data) {
        super();

        this.sufix = 'Handler';
        this.name = this._validate(data.consumer, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;

        this.aggregate =  `${this._validate(data.aggregate, 'Aggregate')}`;
        this.action = data.action.toLowerCase();
        this.domainEvent = `${this._validate(data.domainEvent, 'DomainEvent')}`;
        this.command = this._toPascalCase(data.action);
    }

    static from(data) {
        return new ConsumerModel(data);
    }
}