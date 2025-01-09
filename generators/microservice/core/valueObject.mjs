import path from 'path';

export default class ValueObjectGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'valueObject';
    }

    async generate(options) {
        for (const key in options.valueObjects) {
            const valueObject = options.valueObjects[key];
            
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('value-object/ItemValueObject.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `ValueObjects`, valueObject.file)),
                {
                    ns: `${options.solution}.Domain.ValueObjects`,
                    name: valueObject.fullname
                }
            );
        }
    }

    getArguments() {
        this._generator.option('valueObjects', { type: String, alias: 'vo', required: true, description: 'Comma-separated list of value object names.' });
    }
}
