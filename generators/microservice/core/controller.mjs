import path from 'path';
export default class ControllerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'controller';
    }

    async generate(options) {

        if (options.enableRest)
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('controller/ItemController.cs'),
                this._generator.destinationPath(path.join(options.paths.src.rest, `Controllers`, options.controller.file)),
                {
                    ns: `${options.solution}.Rest.Controllers`,
                    name: options.controller.fullname
                }
            );
    }

    getArguments() {
        this._generator.option('controller', { type: String, alias: 'cr', required: true, description: 'The name of the controller to create.' });

        this._generator.options = {
            ...this._generator.options,
            enableRest: this._generator.options.controller !== undefined && this._generator.options.controller !== null,
        }
    }
}
