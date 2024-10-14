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
    return new ProtoModel(name);
}