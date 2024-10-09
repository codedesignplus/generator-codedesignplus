export default class EntityGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your entity name',
                default: this.name,
                store: true
            }
        ]);
    }

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('entity/ItemEntity.cs'),
            this._generator.destinationPath(`${content.name}Entity.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.Entities`,
                name: this._answers.name
            }
        );
    }
}
