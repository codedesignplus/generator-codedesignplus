import path from 'path';
export default class EntityGenerator {

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
                name: 'entities',
                message: 'Enter the names of the entities you want to create, separated by commas (e.g., Entity1, Entity2).'
            },
        ]);

        return {
            microserviceName: answers.microserviceName,
            entities: answers.entities,
        }
    }

    async generate(options) {        
        for (const key in options.entities) {
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('entity/ItemEntity.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `Entities`, `${options.entities[key]}Entity.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Domain.Entities`,
                    name: options.entities[key]
                }
            );
        }
    }
}
