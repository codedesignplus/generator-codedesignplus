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
    }

    async prompt(defaultValues) {

        let consumer = {
            isEntityOrAggregate: null,
            consumer: null,
            entity: null,
            action: null,
            domainEvent: null
        };

        const { isCrud } = await this._generator.prompt([
            {
                type: 'confirm',
                name: 'isCrud',
                message: 'Do you want to generate a CRUD?'
            }
        ]);

        if (isCrud) {
            const answers = await this._generator.prompt([
                {
                    type: 'input',
                    name: 'microservice',
                    message: 'What is the name of your microservice?',
                    default: defaultValues.microservice
                },
                {
                    type: 'input',
                    name: 'aggregate',
                    message: 'What is the name of the aggregate you want to create?'
                },
                {
                    type: 'confirm',
                    name: 'createControllerForAggregate',
                    message: 'Do you want to create the controller for the aggregate?'
                },
                {
                    type: 'confirm',
                    name: 'createProtoForAggregate',
                    message: 'Do you want to create the proto for the aggregate?'
                },
                {
                    type: 'confirm',
                    name: 'createConsumer',
                    message: 'Do you want to create the consumers?'
                }
            ]);

            if (answers.createConsumer) {
                consumer = await this._consumerGenerator.prompt();
            }

            return {
                microservice: answers.microservice,
                aggregate: answers.aggregate,
                domainEvents: `${answers.aggregate}Created, ${answers.aggregate}Updated, ${answers.aggregate}Deleted`,
                createRepositoryForAggregate: true,
                commands: `Create${answers.aggregate}, Update${answers.aggregate}, Delete${answers.aggregate}`,
                queries: `Get${answers.aggregate}ById, GetAll${answers.aggregate}`,
                createControllerForAggregate: answers.createControllerForAggregate,
                createProtoForAggregate: answers.createProtoForAggregate,
                createConsumer: answers.createConsumer,
                consumer: consumer,
                repository: answers.aggregate,
                dataTransferObject: answers.aggregate,
                controller: answers.aggregate,
                proto: answers.aggregate,
            }
        }

        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microservice',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'input',
                name: 'aggregate',
                message: 'What is the name of the aggregate you want to create?',
                default: defaultValues.microservice
            },
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
                type: 'confirm',
                name: 'enableRepository',
                message: 'Do you want to create a repository for the aggregate?'
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
            },
            {
                type: 'confirm',
                name: 'createControllerForAggregate',
                message: 'Do you want to create the controller for the aggregate?'
            },
            {
                type: 'confirm',
                name: 'createProtoForAggregate',
                message: 'Do you want to create the proto for the aggregate?'
            },
            {
                type: 'confirm',
                name: 'createConsumer',
                message: 'Do you want to create the consumers for the other aggregate?'
            }
        ]);
        
        if (answers.createConsumer) {
            consumer = await this._consumerGenerator.prompt();
        }

        return {
            microservice: answers.microservice,
            aggregate: answers.aggregate,
            domainEvents: answers.domainEvents,
            entities: answers.entities,
            valueObjects: answers.valueObjects,
            createRepositoryForAggregate: answers.enableRepository,
            commands: answers.commands,
            queries: answers.queries,
            createControllerForAggregate: answers.createControllerForAggregate,
            createProtoForAggregate: answers.createProtoForAggregate,
            createConsumer: answers.createConsumer,
            consumer: consumer,
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
}
