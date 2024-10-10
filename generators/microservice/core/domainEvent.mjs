import path from 'path';
export default class DomainEventGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your domain event name',
                store: true,
            },
            {
                type: 'input',
                name: 'entity',
                message: 'Your aggregate or entity name',
                store: true,
            },
            {
                type: 'input',
                name: 'verb',
                message: 'Your verb domain event name',
                store: true,
            }
        ]);
    }

    async generate(options) {

        for (const domainEvent in options.domainEvents) {
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('domain-event/ItemDomainEvent.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `DomainEvents`, `${domainEvent}DomainEvent.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Domain.DomainEvents`,
                    name: domainEvent,
                    entity: options.aggregateName
                }
            );
        }

    }
}
