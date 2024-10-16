export class DomainEventModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'DomainEvent';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}

export function getDomainEvents(items) {
    if (!items) {
        return [];
    }

    return items.split(',').map(x => new DomainEventModel(x));
}