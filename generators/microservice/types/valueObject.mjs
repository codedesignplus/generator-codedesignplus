export class ValueObjectModel {
    constructor(name) {
        name = name.trim();

        this.sufix = '';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}

export function getValueObjects(items) {
    return items?.split(',').map(x => new ValueObjectModel(x)) ?? []
}