export default class AggregateGenerator {

    constructor(utils) {
        this.utils = utils;
    }

    async prompt() {
        const answers = await this.utils.generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your aggregate name',
                default: this.name,
                store: true,
            }
        ]);

        this.name = answers.name;
    }

    async generate() {

        const content = await this.utils.readArchetypeMetadata();

        const from = this.utils.generator.templatePath('aggregate/ItemAggregate.cs');
        const to = this.utils.generator.destinationPath(`${content.name}Aggregate.cs`);

        await this.utils.generator.fs.copyTplAsync(from, to, {
            ns: `${content.organization}.Net.Microservice.${content.name}.Domain`,
            name: this.name,
        });
    }
}
