import BaseModel from "./base.mjs";

export class DomainEventModel extends BaseModel {
    constructor(domainEvent) {
        super();

        this.sufix = 'DomainEvent';
        this.name = this._validate(domainEvent, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }

    static from(value) {
        if(!value)
            return [];

        if (typeof value === 'string' && value.includes(','))
            return value.split(',').map(x => new DomainEventModel(x));

        return [new DomainEventModel(value)];
    }
}
