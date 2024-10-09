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

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        const namespace = `${content.organization}.Net.Microservice.${content.name}.Application.${content.name}.Commands.${this._answers.useCase}`;

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('command/ItemCommand.cs'),
            this._generator.destinationPath(path.join(this._answers.useCase, `${this._answers.useCase}Command.cs`)),
            {
                ns: namespace,
                name: this._answers.name,
                useCase: this._answers.useCase
            }
        );

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('command/ItemCommandHandler.cs'),
            this._generator.destinationPath(path.join(this._answers.useCase, `${this._answers.useCase}CommandHandler.cs`)),
            {
                ns: namespace,
                name: this._answers.name,
                useCase: this._answers.useCase
            }
        );
    }
}
