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
            const handler = options.queries[key];
            const query = handler.query;

            const ns = `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${options.aggregate.name}.Queries.${query.name}`;

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
}
