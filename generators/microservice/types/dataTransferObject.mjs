export class DataTransferObjectModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Dto';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}
export function getDto(name) {
    return new DataTransferObjectModel(name);
}