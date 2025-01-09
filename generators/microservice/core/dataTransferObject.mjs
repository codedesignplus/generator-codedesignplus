import path from 'path';
import { glob } from 'glob';

export default class DtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'dataTransferObject';
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
        this._generator.option('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the microservice\'s root aggregate, essential for domain organization.' });
        this._generator.option('dataTransferObject', { type: String, alias: 'dto', required: true, description: 'A comma-separated list of Data Transfer Object names to be generated.' });
    }
}