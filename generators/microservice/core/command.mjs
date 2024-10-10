import path from 'path';

export default class CommandGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }


    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: `Your command name`,
                default: this.name,
                store: true,
            },
            {
                type: 'input',
                name: 'useCase',
                message: 'Your use case name',
                store: true
            }
        ]);
    }

    async generate(options) {

        for (const command in options.commands) {
            const ns = `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${options.aggregateName}.Commands.${command}`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('command/ItemCommand.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Commands`, command, `${command}Command.cs`)),
                {
                    ns: ns,
                    name: command,
                    aggregate: options.aggregateName,
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('command/ItemCommandHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Commands`, command, `${command}CommandHandler.cs`)),
                {
                    ns: ns,
                    name: command,
                    aggregate: options.aggregateName,
                }
            );
        }
    }
}
