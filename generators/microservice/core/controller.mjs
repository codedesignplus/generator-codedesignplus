import path from 'path';
export default class ControllerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?'
            },
            {
                type: 'input',
                name: 'controller',
                message: 'What is the name of the controller you want to create?'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            controller: answers.controller
        }
    }

    async generate(options) {

        if (options.createControllerForAggregate)
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('controller/ItemController.cs'),
                this._generator.destinationPath(path.join(options.paths.src.rest, `Controllers`, `${options.controller}Controller.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Rest.Controllers`,
                    name: options.controller
                }
            );
    }
}
