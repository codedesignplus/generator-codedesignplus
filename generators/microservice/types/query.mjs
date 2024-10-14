export class QueryModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Query';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}

export class QueryHandlerModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'QueryHandler';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
        this.query = new QueryModel(name);
    }
}

export function getQueries(items) {
    return items?.split(',').map(x => new QueryHandlerModel(x)) ?? []
}