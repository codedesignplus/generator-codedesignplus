import { glob } from 'glob';
import path from 'path';
import RepositoryGenerator from './repository.mjs';

export default class CommandGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'command';
        this._repositoryGenerator = new RepositoryGenerator(this._utils, this._generator);
    }


    async prompt(defaultValues) {
        const aggregates = glob.sync('**/*Aggregate.cs').map(x => path.basename(x, '.cs'));

        const repositories = glob.sync('**/I*Repository.cs').map(x => path.basename(x, '.cs'));

        const answers = await this._generator.prompt([
            {
                type: 'list',
                name: 'aggregate',
                message: 'Select the aggregate you want to associate with commands:',
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

        const match = answers.repository.match(/I(.*)Repository/);
        const name = match ? match[1] : null

        return {
            aggregate: answers.aggregate.replace('Aggregate', ''),
            commands: answers.commands,
            repository: name,
        }
    }

    async generate(options) {

        for (const key in options.commands) {
            const handler = options.commands[key];
            const command = handler.command;

            const ns = `${options.solution}.Application.${options.aggregate.name}.Commands.${command.name}`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('command/ItemCommand.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregate.name, `Commands`, command.name, command.file)),
                {
                    ns: ns,
                    name: command.fullname,

                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('command/ItemCommandHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.application, options.aggregate.name, `Commands`, command.name, handler.file)),
                {
                    ns: ns,
                    name: command.fullname,
                    handler: handler.fullname,
                    repository: options.repository.interface
                }
            );

            this._utils.addUsing(options.paths.src.rest, ns);
        }

        // await this._repositoryGenerator.generate(options);
    }

    getArguments() {
        this._generator.argument('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the aggregate to associate with the commands.' });
        this._generator.argument('repository', { type: String, alias: 'r', required: true, description: 'The name of the repository to associate with the commands.' });
        this._generator.argument('commands', { type: String, alias: 'cs', required: true, description: 'The names of the commands to create, separated by commas. (e.g., CreateItem, UpdateItem)' });
    }
}
