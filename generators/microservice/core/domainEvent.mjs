import { glob } from 'glob';
import path from 'path';

export default class DomainEventGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const aggregates = glob.sync('**/*{Aggregate,Entity}.cs').map(x => path.basename(x, '.cs'));

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
                message: 'Select the entity or aggregate you want to associate with the domain event:',
                choices: aggregates,
            },
            {
                type: 'input',
                name: 'domainEvents',
                message: 'Enter the names of the domain events you want to create, separated by commas (e.g., Event1, Event2).'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.entity,
            domainEvents: answers.domainEvents,
        }
    }

    async generate(options) {

        for (const key in options.domainEvents) {
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('domain-event/ItemDomainEvent.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `DomainEvents`, `${options.domainEvents[key]}DomainEvent.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Domain.DomainEvents`,
                    name: options.domainEvents[key],
                    entity: options.aggregateName
                }
            );
        }

    }
}
