import BaseModel from "./base.mjs";

export class QueryModel extends BaseModel {
    constructor(query) {
        super();

        this.sufix = 'Query';
        this.name = this._validate(query, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }

    static from(value) {
        return new QueryModel(value);
    }
}

export class QueryHandlerModel extends BaseModel {
    constructor(query) {
        super();

        this.sufix = 'QueryHandler';
        this.name = this._validate(query, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
        this.query = QueryModel.from(query);
    }

    static from(value) {
        if(!value)
            return [];

        if (typeof value === 'string' && value.includes(','))
            return value.split(',').map(x => new QueryHandlerModel(x));

        return [new QueryHandlerModel(value)];
    }
}