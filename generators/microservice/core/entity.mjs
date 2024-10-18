import path from 'path';
export default class EntityGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'entity';
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'entities',
                message: 'Enter the names of the entities you want to create, separated by commas (e.g., Entity1, Entity2).'
            },
        ]);

        return {
            entities: answers.entities,
        }
    }

    async generate(options) {
        for (const key in options.entities) {
            const entity = options.entities[key];

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('entity/ItemEntity.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `Entities`, entity.file)),
                {
                    ns: `${options.solution}.Domain.Entities`,
                    name: entity.fullname
                }
            );
        }
    }


    getArguments() {
        this._generator.argument('entities', { type: String, alias: 'e', required: true, description: 'Enter the names of the entities you want to create, separated by commas (e.g., Entity1, Entity2).' });
    }
}
