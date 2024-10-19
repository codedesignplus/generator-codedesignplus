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
        this.name = 'consumer';
    }

    async prompt() {
        const answer = await this._generator.prompt([
            {
                type: 'input',
                name: 'aggregate',
                message: 'What is the name of the aggregate?',
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
            aggregate: answer.aggregate,
            consumer: answer.consumer,
            action: answer.action,
            domainEvent: answer.domainEvent
        }
    }

    async generate(options) {
        
        if (options.createConsumer) {
            
            options = {
                ...options,
                aggregate: AggregateModel.from(options.consumer.aggregate),
                domainEvents: DomainEventModel.from(options.consumer.domainEvent),
                repository: RepositoryModel.from(options.consumer.aggregate),
                commands: CommandHandlerModel.from(options.consumer.command),
                isConsumer: true
            }
            
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('consumer/ItemHandler.cs'),
                this._generator.destinationPath(path.join(options.paths.src.asyncWorker, `Consumers`, options.consumer.file)),
                {
                    ns: `${options.solution}.AsyncWorker.Consumers`,
                    name: options.consumer.fullname,
                    action: options.consumer.action,
                    aggregate: options.consumer.aggregate,
                    domainEvent: `${options.consumer.domainEvent}DomainEvent`
                }
            );

            await this._aggregateGenerator.generate(options);

            await this._repositoryGenerator.generate(options);

            await this._commandGenerator.generate(options);

            await this._domainEventGenerator.generate(options);
        }
    }

    getArguments() {
        this._generator.argument('consumer.consumer', { type: String, required: true, description: 'The name of the consumer' });
        this._generator.argument('consumer.aggregate', { type: String, required: true, description: 'The name of the aggregate' });
        this._generator.argument('consumer.action', { type: String, required: true, description: 'The action that will be associated with the consumer' });
        this._generator.argument('consumer.domainEvent', { type: String, required: true, description: 'The domain event that will be associated with the consumer' });

        this._generator.options = {
            ...this._generator.options,
            consumer: {
                aggregate: this._generator.options['consumer.aggregate'],
                consumer: this._generator.options['consumer.consumer'],
                action: this._generator.options['consumer.action'],
                domainEvent: this._generator.options['consumer.domainEvent']
            }
        };
    }
}
