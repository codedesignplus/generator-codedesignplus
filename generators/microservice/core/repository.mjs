import path from 'path';
export default class RepositoryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'repository';
    }

    async generate(options) {

        if (!options.repository)
            return;

        //Create Interface Repository        
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath(`repository/IItemRepository.cs`),
            this._generator.destinationPath(path.join(options.paths.src.domain, `Repositories`, options.repository.fileInterface)),
            {
                ns: `${options.solution}.Domain.Repositories`,
                name: options.repository.interface,
            }
        );

        //Create Implementation
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath(`repository/ItemRepository.cs`),
            this._generator.destinationPath(path.join(options.paths.src.infrastructure, `Repositories`, options.repository.file)),
            {
                ns: `${options.solution}.Infrastructure.Repositories`,
                name: options.repository.fullname,
                interface: options.repository.interface
            }
        );
    }

    
    getArguments() {
        this._generator.option('repository', { type: String, alias: 'r', required: true, description: 'The name of the aggregate for which the repository is created or queried.' });
    }
}
