export default class ControllerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your controller name',
                default: this.name,
                store: true,
            }
        ]);
    }

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('controller/ItemController.cs'),
            this._generator.destinationPath(`${content.name}Controller.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Rest.Controllers`,
                name: this._answers.name
            }
        );
    }
}
