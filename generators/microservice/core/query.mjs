import path from 'path';
import DtoGenerator from './dataTransferObject.mjs';
import { glob } from 'glob';

export default class QueryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'query';
    }

    async generate(options) {

        await new DtoGenerator(this._utils, this._generator).generate(options);        

        for (const key in options.queries) {
            const handler = options.queries[key];
            const query = handler.query;

            const ns = `${options.solution}.Application.${options.aggregate.name}.Queries.${query.name}`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('query/ItemQuery.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregate.name, `Queries`, query.name, query.file)),
                {
                    ns: ns,
                    name: query.fullname,
                    dto: options.dataTransferObject.fullname
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('query/ItemQueryHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregate.name, `Queries`, query.name, handler.file)),
                {
                    ns: ns,
                    name: query.fullname,
                    handler: handler.fullname,
                    dto: options.dataTransferObject.fullname,
                    repository: options.repository.interface
                }
            );
            
            this._utils.addUsing(options.paths.src.rest, ns);
        }
    }

    getArguments() {
        this._generator.option('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the microservice\'s root aggregate, essential for domain organization.' });
        this._generator.option('repository', { type: String, alias: 'r', required: true, description: 'The name of the aggregate for which the repository is created or queried.' });
        this._generator.option('queries', { type: String, alias: 'q', required: true, description: 'Comma-separated list of queries, representing requests for information from the system.' });

        this._generator.options = {
            ...this._generator.options,
            dataTransferObject: this._generator.options.aggregate
        }
    }
}
