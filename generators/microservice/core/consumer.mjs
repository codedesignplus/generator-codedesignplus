import EntityGenerator from './entity.mjs';
import DomainEventGenerator from './domainEvent.mjs';
import AggregateGenerator from './aggregate.mjs';
import { AggregateModel, DomainEventModel, EntityModel } from '../types/index.mjs';
import path from 'path';

export default class ConsumerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this._entityGenerator = new EntityGenerator(this._utils, this._generator);
        this._domainEventGenerator = new DomainEventGenerator(this._utils, this._generator);
        this._aggregateGenerator = new AggregateGenerator(this._utils, this._generator);
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
                name: 'entity',
                message: 'What is the name of the entity or aggregate you want to associate?',
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
            entity: answer.entity,
            action: answer.action,
            domainEvent: answer.domainEvent
        }
    }

    async generate(options) {
        if (options.createConsumer) {

            console.log('Creating consumer...');

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

            console.log(`Consumer ${options.consumer.fullname} created successfully!`);

            switch (options.isEntityOrAggregate) {
                case 'Entity':
                    await this._entityGenerator.generate({ ...options, entities: [new EntityModel(options.consumer.entity)]  });
                    break;
                case 'Aggregate':
                    await this._aggregateGenerator.generate({ ...options, aggregate: new AggregateModel(options.consumer.entity) });
                    break;
            }

            console.log(`Entity ${options.consumer.entity} created successfully!`);

            await this._domainEventGenerator.generate({ ...options, domainEvents: [new DomainEventModel(options.consumer.domainEvent)] });

            console.log(`Domain Event ${options.consumer.domainEvent} created successfully!`);
        }
    }
}
