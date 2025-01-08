import { glob } from 'glob';
import path from 'path';

export default class DomainEventGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'domainEvent';
    }

    async generate(options) {

        const to = options.isConsumer ? options.paths.src.asyncWorker : options.paths.src.domain;
        const ns = options.isConsumer ? `${options.solution}.AsyncWorker.DomainEvents` : `${options.solution}.Domain.DomainEvents`;

        for (const key in options.domainEvents) {
            const domainEvent = options.domainEvents[key];

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('domain-event/ItemDomainEvent.cs'),
                this._generator.destinationPath(path.join(to, `DomainEvents`, domainEvent.file)),
                {
                    ns: ns,
                    name: domainEvent.fullname,
                    entity: options.aggregate.fullname
                }
            );
        }
    }

    getArguments() {
        this._generator.option('aggregate', { type: String, alias: 'e', required: true, description: 'The name of the aggregate to associate with the domain event.' });
        this._generator.option('domainEvents', { type: String, alias: 'de', required: true, description: 'The names of the domain events to create, separated by commas. (e.g., OrgCreated, OrgUpdated)' });
    }
}
