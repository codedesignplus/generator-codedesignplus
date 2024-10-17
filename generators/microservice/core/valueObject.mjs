import path from 'path';

export default class ValueObjectGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microservice',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'input',
                name: 'valueObjects',
                message: 'Enter the names of the value objects you want to create, separated by commas (e.g., ValueObject1, ValueObject2).'
            },
        ]);

        return {
            microservice: answers.microservice,
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
                    ns: `${options.organization}.Net.Microservice.${options.microservice}.Domain.ValueObjects`,
                    name: valueObject.fullname
                }
            );
        }
    }
}
