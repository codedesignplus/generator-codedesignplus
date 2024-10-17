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
                name: 'aggregate',
                message: 'What is the name of the aggregate you want to create?'
            }
        ]);

        return {
            aggregate: answers.aggregate
        }
    }

    async generate(options) {        
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('aggregate/ItemAggregate.cs'),
            this._generator.destinationPath(path.join(options.paths.src.domain, options.aggregate.file)),
            {
                ns: `${options.solution}.Domain`,
                name: options.aggregate.fullname
            }
        );
    }

    getArguments() {
        this._generator.argument('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the aggregate to create' });
    }
}
