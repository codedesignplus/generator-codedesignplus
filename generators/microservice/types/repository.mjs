import BaseModel from "./base.mjs";

export class RepositoryModel extends BaseModel {
    constructor(repository) {
        super();

        this.sufix = 'Repository';
        this.name = this._validate(repository, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
        this.interface = `I${this.fullname}`;
        this.fileInterface = `${this.interface}.cs`;
    }

    static from(value) {
        if (!value)
            return null;

        return new RepositoryModel(value);
    }
}