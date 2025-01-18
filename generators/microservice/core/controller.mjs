import path from 'path';
export default class ControllerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'controller';
    }

    async generate(options) {

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
    }
}
