import path from 'path';
import DtoGenerator from './dataTransferObject.mjs';
import { glob } from 'glob';

export default class QueryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const aggregates = glob.sync('**/*Aggregate.cs').map(x => path.basename(x, '.cs'));

        const repositories = glob.sync('**/I*Repository.cs').map(x => path.basename(x, '.cs'));
        
        const answers = await this._generator.prompt([
            {
                type: 'list',
                name: 'aggregate',
                message: 'Select the aggregate you want to associate with queries:',
                choices: aggregates,
            },
            {
                type: 'list',
                name: 'repository',
                message: 'Select the repository you want to associate with queries :',
                choices: repositories,
            },
            {
                type: 'input',
                name: 'queries',
                message: 'Enter the names of the queries you want to create, separated by commas (e.g., Query1, Query2).'
            },
        ]);

        
        const match = answers.repository.match(/I(.*)Repository/);
        const name = match ? match[1] : null

        return {
            aggregate: answers.aggregate,
            queries: answers.queries,
            repository: name,
            dataTransferObject: answers.aggregate
        }
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
        this._generator.argument('aggregate', { type: String, alias: 'a', required: true });
        this._generator.argument('repository', { type: String, alias: 'r', required: true });
        this._generator.argument('queries', { type: String, alias: 'q', required: true });
    }
}
