export class RepositoryModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Repository';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
        this.interface = `I${this.fullname}`;
        this.fileInterface = `${this.interface}.cs`;
    }
}
export function getRepository(name) {
    return new RepositoryModel(name);
}