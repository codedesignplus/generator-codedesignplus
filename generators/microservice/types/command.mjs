import { toPascalCase, BaseModel } from "./base.mjs";

export class CommandModel extends BaseModel {
    constructor(command) {
        super();

        this.sufix = 'Command';
        this.name = this._validate(command, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }

    static from(value) {
        return new CommandModel(toPascalCase(value));
    }
}

export class CommandHandlerModel extends BaseModel {
    constructor(command) {
        super();

        this.sufix = 'CommandHandler';
        this.name = this._validate(command, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.command = CommandModel.from(command);
        this.file = `${this.fullname}.cs`;
    }
    
    static from(value) {
        if(!value)
            return [];

        if (typeof value === 'string' && value.includes(','))
            return value.split(',').map(x => new CommandHandlerModel(toPascalCase(x)));

        return [new CommandHandlerModel(toPascalCase(value))];
    }
}