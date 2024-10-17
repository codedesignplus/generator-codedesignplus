import path from 'path';

export default class AggregateGenerator {

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
                name: 'aggregate',
                message: 'What is the name of the aggregate you want to create?'
            }
        ]);

        return {
            microservice: answers.microservice,
            aggregate: answers.aggregate
        }
    }

    async generate(options) {
        console.log('Creating aggregate...');

        console.log('Options Aggregate', options);
        
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('aggregate/ItemAggregate.cs'),
            this._generator.destinationPath(path.join(options.paths.src.domain, options.aggregate.file)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microservice}.Domain`,
                name: options.aggregate.fullname
            }
        );
    }
}
