import path from 'path';
export default class EntityGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'entity';
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
        this._generator.option('entities', { type: String, alias: 'e', required: true, description: 'Comma-separated list of entities.' });
    }
}
