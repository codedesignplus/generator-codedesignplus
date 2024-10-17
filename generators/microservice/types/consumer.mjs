import BaseModel from "./base.mjs";

export class ConsumerModel extends BaseModel {
    constructor(data) {
        super();

        this.sufix = 'Handler';
        this.name = this._validate(data.consumer, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;

        this.isEntityOrAggregate = data.isEntityOrAggregate;
        this.entity = `${this.name}${this.isEntityOrAggregate === 'Entity' ? 'Entity' : 'Aggregate'}`;
        this.action = data.action.toLowerCase();
        this.domainEvent = `${this._validate(data.domainEvent, 'DomainEvent')}DomainEvent`;
        this.command = this._toPascalCase(data.action);
    }

    static from(data) {
        return new ConsumerModel(data);
    }
}