import path from 'path';
export default class RepositoryGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([  
            {
                type: 'input',
                name: 'repository',
                message: 'What is the name of the repository you want to create?'
            }
        ]);

        return {
            repository: answers.repository,
            createRepositoryForAggregate: true
        }
    }

    async generate(options) {

        if (!options.createRepositoryForAggregate)
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
        this._generator.argument('repository', { type: String, alias: 'r', required: true });
    }
}
