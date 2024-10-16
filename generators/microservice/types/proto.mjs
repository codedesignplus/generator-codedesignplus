export class ProtoModel {
    constructor(name) {
        name = name.trim();

        this.sufix = '';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.proto`.toLowerCase();
    }
}
export function getProto(name) {
    if (!name) {
        return null;
    }
    return new ProtoModel(name);
}