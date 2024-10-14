import path from 'path';
import { glob } from 'glob';

export default class DtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const aggregates = glob.sync('**/*Aggregate.cs').map(x => path.basename(x, '.cs'));

        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'list',
                name: 'entity',
                message: 'Select the aggregate you want to associate with the data transfer object:',
                choices: aggregates,
            },
            {
                type: 'input',
                name: 'dataTransferObject',
                message: 'What is the name of the data transfer object you want to create?'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.entity,
            dataTransferObject: answers.dataTransferObject
        }
    }

    async generate(options) {

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('data-transfer-object/ItemDto.cs'),
            this._generator.destinationPath(path.join(options.paths.src.application, options.aggregate.name, `DataTransferObjects`, options.dataTransferObject.file)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${options.aggregate.name}.DataTransferObjects`,
                name: options.dataTransferObject.fullname
            }
        );
    }
}