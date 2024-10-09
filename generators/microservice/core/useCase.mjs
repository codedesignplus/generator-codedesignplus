export default class UseCaseGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._.generator.prompt([
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
            this._generator.templatePath('data-transfer-object/ItemDto.cs'),
            this._generator.destinationPath(`${content.name}Dto.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.DataTransferObjects`,
                name: this._answers.name
            }
        );
    }
}
