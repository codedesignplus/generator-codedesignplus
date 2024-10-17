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
                type: 'list',
                name: 'aggregate',
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
            aggregate: answers.aggregate.replace('Aggregate', ''),
            dataTransferObject: answers.dataTransferObject
        }
    }

    async generate(options) {

        const ns = `${options.solution}.Application.${options.aggregate.name}.DataTransferObjects`;
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('data-transfer-object/ItemDto.cs'),
            this._generator.destinationPath(path.join(options.paths.src.application, options.aggregate.name, `DataTransferObjects`, options.dataTransferObject.file)),
            {
                ns: ns,
                name: options.dataTransferObject.fullname
            }
        );

        this._utils.addUsing(options.paths.src.application, ns);
    }

    getArguments() {
        this._generator.argument('aggregate', { type: String, alias: 'a', required: true });
        this._generator.argument('dataTransferObject', { type: String, alias: 'dto', required: true });
    }
}