import path from 'path';

export default class QueryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: `Your command name`
            },
            {
                type: 'input',
                name: 'useCase',
                message: 'Your use case name'
            }
        ]);
    }

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        const namespace = `${content.organization}.Net.Microservice.${content.name}.Application.${content.name}.Queries.${this._answers.useCase}`;

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('query/ItemQuery.cs'),
            this._generator.destinationPath(path.join(this._answers.useCase, `${this._answers.useCase}Query.cs`)),
            {
                ns: namespace,
                name: this._answers.name,
                useCase: this._answers.useCase
            }
        );

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('query/ItemQueryHandler.cs'),
            this._generator.destinationPath(path.join(this._answers.useCase, `${this._answers.useCase}QueryHandler.cs`)),
            {
                ns: namespace,
                name: this._answers.name,
                useCase: this._answers.useCase
            }
        );
    }
}
