import { glob } from 'glob';
import path from 'path';

export default class DomainEventGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const aggregates = glob.sync('**/*Aggregate.cs').map(x => path.basename(x, '.cs'));

        const answers = await this._generator.prompt([
            {
                type: 'list',
                name: 'entity',
                message: 'Select the aggregate you want to associate with the domain event:',
                choices: aggregates,
            },
            {
                type: 'input',
                name: 'domainEvents',
                message: 'Enter the names of the domain events you want to create, separated by commas (e.g., Event1, Event2).'
            }
        ]);

        return {
            aggregate: answers.entity.replace('Aggregate', ''),
            domainEvents: answers.domainEvents,
        }
    }

    async generate(options) {

        for (const key in options.domainEvents) {
            const domainEvent = options.domainEvents[key];

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('domain-event/ItemDomainEvent.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `DomainEvents`, domainEvent.file)),
                {
                    ns: `${options.solution}.Domain.DomainEvents`,
                    name: domainEvent.fullname,
                    entity: options.aggregate.fullname
                }
            );
        }
    }

    getArguments() {
        this._generator.argument('entity', { type: String, alias: 'e', required: true });
        this._generator.argument('domainEvents', { type: String, alias: 'de', required: true });
    }
}
