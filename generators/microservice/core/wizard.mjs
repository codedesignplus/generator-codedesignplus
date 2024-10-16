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

export default class WizardGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'input',
                name: 'aggregate',
                message: 'What is the name of the aggregate you want to create?'
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
            }
        ]);

        answers['repository'] = answers.aggregate;
        answers['dataTransferObject'] = answers.aggregate;
        answers['controller'] = answers.aggregate;
        answers['proto'] = answers.aggregate;

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.aggregate,
            domainEvents: answers.domainEvents,
            entities: answers.entities,
            valueObjects: answers.valueObjects,
            createRepositoryForAggregate: answers.enableRepository,
            commands: answers.commands,
            queries: answers.queries,
            createControllerForAggregate: answers.createControllerForAggregate,
            createProtoForAggregate: answers.createProtoForAggregate,
            repository: answers.repository,
            dataTransferObject: answers.dataTransferObject,
            controller: answers.controller,
            proto: answers.proto
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
            'Proto': ProtoGenerator
        };

        for (const key in generatorsMap) {
            console.log('Generator', key);
            
            const generator = new generatorsMap[key](this._utils, this._generator);

            await generator.generate(options);
        }
    }
}
