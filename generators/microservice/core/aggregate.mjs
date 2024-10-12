import path from 'path';

export default class AggregateGenerator {

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
                name: 'aggregateName',
                message: 'What is the name of the aggregate you want to create?'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.aggregateName
        }
    }

    async generate(options) {
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('aggregate/ItemAggregate.cs'),
            this._generator.destinationPath(path.join(options.paths.src.domain , `${options.aggregateName}Aggregate.cs`)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Domain`,
                name: options.aggregateName
            }
        );
    }
}
