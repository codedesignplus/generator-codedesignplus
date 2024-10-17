import EntityGenerator from './entity.mjs';
import DomainEventGenerator from './domainEvent.mjs';
import AggregateGenerator from './aggregate.mjs';
import RepositoryGenerator from './repository.mjs';
import CommandGenerator from './command.mjs';
import { AggregateModel, DomainEventModel, EntityModel, RepositoryModel, CommandHandlerModel } from '../types/index.mjs';
import path from 'path';

export default class ConsumerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this._entityGenerator = new EntityGenerator(this._utils, this._generator);
        this._domainEventGenerator = new DomainEventGenerator(this._utils, this._generator);
        this._aggregateGenerator = new AggregateGenerator(this._utils, this._generator);
        this._repositoryGenerator = new RepositoryGenerator(this._utils, this._generator);
        this._commandGenerator = new CommandGenerator(this._utils, this._generator);
    }

    async prompt() {
        const answer = await this._generator.prompt([
            {
                type: 'list',
                name: 'isEntityOrAggregate',
                message: 'Do you want to generate a consumer to entity or a aggregate?',
                choices: ['Entity', 'Aggregate']
            },
            {
                type: 'input',
                name: 'consumer',
                message: 'What is the name of your consumer?',
                default: 'Org'
            },
            {
                type: 'input',
                name: 'action',
                message: 'What is the action you want to perform?',
                default: 'create_org'
            },
            {
                type: 'input',
                name: 'domainEvent',
                message: 'What is the name of the domain event you want to associate?',
                default: 'OrgCreated'
            }
        ]);

        return {
            isEntityOrAggregate: answer.isEntityOrAggregate,
            consumer: answer.consumer,
            action: answer.action,
            domainEvent: answer.domainEvent
        }
    }

    async generate(options) {
        if (options.createConsumer) {

            options = {
                ...options,
                entities: EntityModel.from(options.consumer.name),
                aggregate: AggregateModel.from(options.consumer.name),
                domainEvents: DomainEventModel.from(options.consumer.domainEvent),
                createRepositoryForAggregate: true,
                repository: RepositoryModel.from(options.consumer.name),
                commands: CommandHandlerModel.from(options.consumer.command)
            }

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('consumer/ItemHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.asyncWorker, `Consumers`, options.consumer.file)),
                {
                    ns: `${options.solution}.AsyncWorker.Consumers`,
                    name: options.consumer.fullname,
                    action: options.consumer.action,
                    entity: options.consumer.entity,
                    domainEvent: options.consumer.domainEvent
                }
            );

            switch (options.consumer.isEntityOrAggregate) {
                case 'Entity':
                    await this._entityGenerator.generate(options);
                    break;
                case 'Aggregate':
                    await this._aggregateGenerator.generate(options);
                    break;
            }

            await this._repositoryGenerator.generate(options);

            await this._commandGenerator.generate(options);

            await this._domainEventGenerator.generate(options);
        }
    }

    getArguments() {
        this.argument('isEntityOrAggregate', { type: String, required: true });
        this.argument('consumer', { type: String, alias: 'cr', required: true });
        this.argument('action', { type: String, alias: 'an', required: true });
        this.argument('domainEvent', { type: String, alias: 'de', required: true });
    }
}
