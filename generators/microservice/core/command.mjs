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
        this._generator.option('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the microservice\'s root aggregate, essential for domain organization.' });
        this._generator.option('repository', { type: String, alias: 'r', required: true, description: 'The name of the aggregate for which the repository is created or queried.' });
        this._generator.option('commands', { type: String, alias: 'cs', required: true, description: 'Comma-separated list of commands representing actions from the user or system.' });
    }
}
