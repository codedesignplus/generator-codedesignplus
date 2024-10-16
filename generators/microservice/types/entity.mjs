export class EntityModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Entity';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}

export function getEntities(items) {
    if (!items) {
        return [];
    }
    return items.split(',').map(x => new EntityModel(x));
}