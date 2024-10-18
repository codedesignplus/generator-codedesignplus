import path from 'path';

export default class ValueObjectGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'valueObject';
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'valueObjects',
                message: 'Enter the names of the value objects you want to create, separated by commas (e.g., ValueObject1, ValueObject2).'
            },
        ]);

        return {
            valueObjects: answers.valueObjects,
        }
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
        this._generator.argument('valueObjects', { type: String, alias: 'vo', required: true, description: 'Value objects to create, separated by commas. (e.g., Address, Contact)' });
    }
}
