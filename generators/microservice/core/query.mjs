import path from 'path';
import DtoGenerator from './dataTransferObject.mjs';
import { glob } from 'glob';

export default class QueryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const aggregates = glob.sync('**/*{Aggregate,Entity}.cs').map(x => path.basename(x, '.cs'));

        const repositories = glob.sync('**/I*Repository.cs').map(x => path.basename(x, '.cs'));
        
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'list',
                name: 'entity',
                message: 'Select the entity or aggregate you want to associate with queries:',
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

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.entity,
            queries: answers.queries,
            repository: answers.repository,
            dataTransferObject: answers.entity
        }
    }

    async generate(options) {

        await new DtoGenerator(this._utils, this._generator).generate(options);        

        for (const key in options.queries) {
            const query = options.queries[key];

            const ns = `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${options.aggregateName}.Queries.${query}`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('query/ItemQuery.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Queries`, query, `${query}Query.cs`)),
                {
                    ns: ns,
                    name: query,
                    dto: options.dataTransferObject
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('query/ItemQueryHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Queries`, query, `${query}QueryHandler.cs`)),
                {
                    ns: ns,
                    name: query,
                    dto: options.dataTransferObject,
                    repository: options.repository
                }
            );
        }
    }
}
