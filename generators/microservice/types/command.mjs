export class CommandModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Command';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}

export class CommandHandlerModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'CommandHandler';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.command = new CommandModel(name);
        this.file = `${this.fullname}.cs`;
    }
}

export function getCommands(items) {
    if (!items) {
        return [];
    }

    return items.split(',').map(x => new CommandHandlerModel(x));
}