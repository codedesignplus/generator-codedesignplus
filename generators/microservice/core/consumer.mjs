export default class ConsumerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        this._answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your consumer name',
            },
            {
                type: 'input',
                name: 'entity',
                message: 'Your entity name',
            },
            {
                type: 'input',
                name: 'action',
                message: 'Your action name',
            }
        ]);
    }

    async generate() {
        const content = await this._utils.readArchetypeMetadata();

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('consumer/ItemHandler.cs'),
            this._generator.destinationPath(`${content.name}Handler.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.AsyncWorker.Consumers`,
                name: this._answers.name,
                action: this._answers.action,
                entity: this._answers.entity.toLowerCase()
            }
        );
    }
}
