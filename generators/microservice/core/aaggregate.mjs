import path from 'path';

export default class AggregateGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your aggregate name'
            }
        ]);
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
