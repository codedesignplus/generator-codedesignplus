import path from 'path';

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

    async generate(options) {
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('data-transfer-object/ItemDto.cs'),
            this._generator.destinationPath(path.join(options.paths.src.application, `${options.aggregateName}`, `DataTransferObjects`, `${options.aggregateName}Dto.cs`)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Application.DataTransferObjects`,
                name: options.aggregateName
            }
        );
    }
}
