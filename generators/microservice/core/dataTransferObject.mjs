export default class DtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your data transfer object name',
                default: this.name,
                store: true,
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
