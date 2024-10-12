import { glob } from 'glob';
import path from 'path';

export default class CommandGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }


    async prompt() {
        const aggregates = glob.sync('**/*{Aggregate,Entity}.cs').map(x => path.basename(x, '.cs'));

        const repositories = glob.sync('**/I*Repository.cs').map(x => path.basename(x, '.cs'));

        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?'
            },
            {
                type: 'list',
                name: 'entity',
                message: 'Select the entity or aggregate you want to associate with commands:',
                choices: aggregates,
            },
            {
                type: 'list',
                name: 'repository',
                message: 'Select the repository you want to associate with commands:',
                choices: repositories,
            },
            {
                type: 'input',
                name: 'commands',
                message: 'Enter the names of the commands you want to create, separated by commas (e.g., Command1, Command2).'
            },
        ]);

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.entity,
            commands: answers.commands,
            repository: answers.repository,
        }
    }

    async generate(options) {

        for (const key in options.commands) {
            const command = options.commands[key];

            const ns = `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${options.aggregateName}.Commands.${command}`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('command/ItemCommand.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Commands`, command, `${command}Command.cs`)),
                {
                    ns: ns,
                    name: command
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('command/ItemCommandHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregateName, `Commands`, command, `${command}CommandHandler.cs`)),
                {
                    ns: ns,
                    name: command,
                    repository: options.repository
                }
            );
        }
    }
}
