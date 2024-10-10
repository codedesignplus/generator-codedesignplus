import path from 'path';
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

    async generate(options) {

        if (options.createControllerForAggregate)
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('controller/ItemController.cs'),
                this._generator.destinationPath(path.join(options.paths.src.rest, `Controllers`, `${options.aggregateName}Controller.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Rest.Controllers`,
                    name: options.aggregateName
                }
            );
    }
}
