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

    async generate(options) {

        for (const query in options.queries) {
            const ns = `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${options.aggregateName}.Queries.${query}`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('query/ItemQuery.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Queries`, query, `${query}Query.cs`)),
                {
                    ns: ns,
                    name: query,
                    aggregate: options.aggregateName
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('query/ItemQueryHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Queries`, query, `${query}QueryHandler.cs`)),
                {
                    ns: ns,
                    name: query,
                    aggregate: options.aggregateName
                }
            );
        }
    }
}
