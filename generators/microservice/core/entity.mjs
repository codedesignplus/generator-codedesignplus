import path from 'path';
export default class EntityGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your entity name',
                default: this.name,
                store: true
            }
        ]);
    }

    async generate(options) {        
        for (const entity in options.entities) {
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('entity/ItemEntity.cs'),
                this._generator.destinationPath(path.join(options.paths.src.domain, `Entities`, `${entity}.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Domain.Entities`,
                    name: entity
                }
            );
        }
    }
}
