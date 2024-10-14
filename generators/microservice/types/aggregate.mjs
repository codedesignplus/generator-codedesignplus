export class AggregateModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Aggregate';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}
export function getAggregate(name) {
    return new AggregateModel(name);
}