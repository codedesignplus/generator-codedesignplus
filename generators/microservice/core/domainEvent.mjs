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

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('domain-event/ItemDomainEvent.cs'),
            this._generator.destinationPath(`${this._answers.name}DomainEvent.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.DomainEvents`,
                name: this._answers.name,
                entity: this._answers.entity,
                verb: this._answers.verb
            }
        );
    }
}
