export default class ErrorsGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'list',
                name: 'layer',
                message: 'Select the layer',
                choices: [
                    'Domain',
                    'Application',
                    'Infrastructure'
                ]
            }
        ]);
    }

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('errors/ItemEntity.cs'),
            this._generator.destinationPath(`Errors.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.${this._answers.layer}`,
                code: `${this._getCode()} : UnknownError`,
            }
        );
    }

    _getCode() {
        const layers = { 'Domain': '000', 'Application': '100', 'Infrastructure': '200' };

        return layers[this._answers.layer];
    }
}
