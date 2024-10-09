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

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath(`repository/${this._answers.isInterface ? 'I' : ''}ItemRepository.cs`),
            this._generator.destinationPath(`${this._answers.isInterface ? 'I' : ''}${this._answers.name}Repository.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.${this._answers.isInterface ? 'Domain' : 'Infrastructure'}.Repositories`,
                name: this._answers.name,
            }
        );
    }
}
