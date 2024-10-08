export default class ValueObjectGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your value object name',
                default: this.name,
                store: true
            }
        ]);
    }

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('value-object/ItemValueObject.cs'),
            this._generator.destinationPath(`${content.name}ValueObject.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.ValueObject`,
                name: this._answers.name
            }
        );
    }
}
