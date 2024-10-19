import AggregateGenerator from './aggregate.mjs';
import CommandGenerator from './command.mjs';
import QueryGenerator from './query.mjs';
import ControllerGenerator from './controller.mjs';
import DtoGenerator from './dataTransferObject.mjs';
import ValueObjectGenerator from './valueObject.mjs';
import DomainEventGenerator from './domainEvent.mjs';
import EntityGenerator from './entity.mjs';
import RepositoryGenerator from './repository.mjs';
import ProtoGenerator from './proto.mjs';
import ConsumerGenerator from './consumer.mjs';

export default class WizardGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this._consumerGenerator = new ConsumerGenerator(this._utils, this._generator);
        this.name = 'wizard';
    }

    async _prompt(defaultValues) {
        let answers = await this._prompCrud();

        if (!answers.isCrud) {
            const data = await this._prompWizard(answers.aggregate);

            answers = {
                ...answers,
                ...data,
                consumer: {
                    isEntityOrAggregate: null,
                    consumer: null,
                    entity: null,
                    action: null,
                    domainEvent: null
                }
            }
        }

        if (answers.createConsumer)
            answers.consumer = await this._consumerGenerator.prompt();

        return {
            aggregate: answers.aggregate,
            domainEvents: answers.domainEvents,
            entities: answers.entities,
            valueObjects: answers.valueObjects,
            commands: answers.commands,
            queries: answers.queries,
            createController: answers.createController,
            createProto: answers.createProto,
            createConsumer: answers.createConsumer,
            consumer: answers.consumer,
            repository: answers.aggregate,
            dataTransferObject: answers.aggregate,
            controller: answers.aggregate,
            proto: answers.aggregate
        };
    }

    async generate(options) {

        const generatorsMap = {
            'Aggregate': AggregateGenerator,
            'Domain Event': DomainEventGenerator,
            'Entity': EntityGenerator,
            'Value Object': ValueObjectGenerator,
            'Repository': RepositoryGenerator,
            'Data Transfer Object': DtoGenerator,
            'Command': CommandGenerator,
            'Query': QueryGenerator,
            'Controller': ControllerGenerator,
            'Proto': ProtoGenerator,
            'Consumer': ConsumerGenerator
        };

        for (const key in generatorsMap) {
            const generator = new generatorsMap[key](this._utils, this._generator);

            await generator.generate(options);
        }
    }

    getArguments() {
        this._generator.option('isCrud', { type: Boolean, required: false, description: 'Indicates whether the wizard should generate a CRUD.' });
        this._generator.argument('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the aggregate to create.' });
        this._generator.option('createController', { type: Boolean, required: true, description: 'Indicates whether the wizard should create a controller for the aggregate.' });
        this._generator.option('createProto', { type: Boolean, required: true, description: 'Indicates whether the wizard should create a proto for the aggregate.' });
        this._generator.option('createConsumer', { type: Boolean, required: true, description: 'Indicates whether the wizard should create consumers.' });

        this._generator.options = {
            ...this._generator.options,
            aggregate: this._generator.options.aggregate,
            domainEvents: `${this._generator.options.aggregate}Created, ${this._generator.options.aggregate}Updated, ${this._generator.options.aggregate}Deleted`,
            commands: `Create${this._generator.options.aggregate}, Update${this._generator.options.aggregate}, Delete${this._generator.options.aggregate}`,
            queries: `Get${this._generator.options.aggregate}ById, GetAll${this._generator.options.aggregate}`,
        }

        if (this._generator.options.createConsumer)
            this._consumerGenerator.getArguments();

        if (!this._generator.options.isCrud) {
            this._generator.option('domainEvents', { type: String, alias: 'de', required: false, description: 'The names of the domain events to create, separated by commas. (e.g., OrgCreated, OrgUpdated)' });
            this._generator.option('entities', { type: String, alias: 'e', required: false, description: 'The names of the entities to create, separated by commas. (e.g., Org, User)' });
            this._generator.option('commands', { type: String, alias: 'cs', required: false, description: 'The names of the commands to create, separated by commas. (e.g., CreateOrg, UpdateOrg)' });
            this._generator.option('queries', { type: String, alias: 'q', required: false, description: 'The names of the queries to create, separated by commas. (e.g., GetOrg, GetOrgs)' });
        }

        this._generator.options = {
            ...this._generator.options,
            repository: this._generator.options.aggregate,
            controller: this._generator.options.aggregate,
            dataTransferObject: this._generator.options.aggregate,
            proto: this._generator.options.aggregate
        }
    }

    async _prompCrud() {
        const answers = await this._generator.prompt([
            {
                type: 'confirm',
                name: 'isCrud',
                message: 'Do you want to generate a CRUD?'
            },
            {
                type: 'input',
                name: 'aggregate',
                message: 'What is the name of the aggregate you want to create?'
            },
            {
                type: 'confirm',
                name: 'createController',
                message: 'Do you want to create the controller for the aggregate?'
            },
            {
                type: 'confirm',
                name: 'createProto',
                message: 'Do you want to create the proto for the aggregate?'
            },
            {
                type: 'confirm',
                name: 'createConsumer',
                message: 'Do you want to create the consumers?'
            }
        ])

        return {
            aggregate: answers.aggregate,
            domainEvents: `${answers.aggregate}Created, ${answers.aggregate}Updated, ${answers.aggregate}Deleted`,
            commands: `Create${answers.aggregate}, Update${answers.aggregate}, Delete${answers.aggregate}`,
            queries: `Get${answers.aggregate}ById, GetAll${answers.aggregate}`,
            createProto: answers.createProto,
            createController: answers.createController,
            createConsumer: answers.createConsumer,
            isCrud: answers.isCrud
        };
    }

    async _prompWizard(aggregate) {
        const data = await this._generator.prompt([
            {
                type: 'input',
                name: 'domainEvents',
                message: 'Enter the names of the domain events you want to create, separated by commas (e.g., Event1, Event2).'
            },
            {
                type: 'input',
                name: 'entities',
                message: 'Enter the names of the entities you want to create, separated by commas (e.g., Entity1, Entity2).'
            },
            {
                type: 'input',
                name: 'valueObjects',
                message: 'Enter the names of the value objects you want to create, separated by commas (e.g., ValueObject1, ValueObject2).'
            },
            {
                type: 'input',
                name: 'commands',
                message: 'Enter the names of the commands you want to create, separated by commas (e.g., Command1, Command2).'
            },
            {
                type: 'input',
                name: 'queries',
                message: 'Enter the names of the queries you want to create, separated by commas (e.g., Query1, Query2).'
            }
        ]);

        return {
            domainEvents: data.domainEvents,
            entities: data.entities,
            valueObjects: data.valueObjects,
            commands: data.commands,
            queries: data.queries,
            repository: aggregate,
            controller: aggregate,
            dataTransferObject: aggregate,
            proto: aggregate
        };
    }
}
