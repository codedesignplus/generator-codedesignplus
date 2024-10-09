export default class AggregateGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your aggregate name'
            }
        ]);
    }

    async generate() {

        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('aggregate/ItemAggregate.cs'),
            this._generator.destinationPath(`${content.name}Aggregate.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain`,
                name: this._answers.name
            }
        );
    }
}
