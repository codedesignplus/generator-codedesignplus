import path from 'path';
export default class RepositoryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your repository name',
                default: this.name,
                store: true
            },
            {
                type: 'confirm',
                name: 'isInterface',
                message: 'Is a interface repository?',
                default: '',
            }
        ]);
    }

    async generate(options) {

        if (!options.createRepositoryForAggregate)
            return;

        //Create Interface Repository        
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath(`repository/IItemRepository.cs`),
            this._generator.destinationPath(path.join(options.paths.src.domain, `Repositories`, `I${options.aggregateName}Repository.cs`)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Domain.Repositories`,
                name: options.aggregateName,
            }
        );

        //Create Implementation
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath(`repository/ItemRepository.cs`),
            this._generator.destinationPath(path.join(options.paths.src.infrastructure, `Repositories`, `${options.aggregateName}Repository.cs`)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Infrastructure.Repositories`,
                name: options.aggregateName,
            }
        );
    }
}
