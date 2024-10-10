import AggregateGenerator from './aaggregate.mjs';
import CommandGenerator from './command.mjs';
import QueryGenerator from './query.mjs';
import ConsumerGenerator from './consumer.mjs';
import ControllerGenerator from './controller.mjs';
import DtoGenerator from './dataTransferObject.mjs';
import DomainEventGenerator from './domainEvent.mjs';
import EntityGenerator from './entity.mjs';
import RepositoryGenerator from './repository.mjs';
import path from 'path';

export default class WizardGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of your microservice?'
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
                name: 'repository',
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
                name: 'controller',
                message: 'Do you want to create the controller for the aggregate?'
            },
            {
                type: 'confirm',
                name: 'service',
                message: 'Do you want to create the service for the aggregate?'
            }
        ]);

        this._answers = {
            "organization": this._generator.answers.organization,
            "microserviceName": answers.name,
            "aggregateName": answers.aggregate,
            "domainEvents": answers.domainEvents.split(',').map(x => x.trim()),
            "entities": answers.entities.split(',').map(x => x.trim()),
            "valueObjects": answers.valueObjects.split(',').map(x => x.trim()),
            "createRepositoryForAggregate": answers.repository,
            "commands": answers.commands.split(',').map(x => x.trim()),
            "queries": answers.queries.split(',').map(x => x.trim()),
            "createControllerForAggregate": answers.controller,
            "createServiceForAggregate": answers.service,
            "solution": `${this._generator.answers.organization}.Net.Microservice.${answers.name}`,
            "paths": {
                "src": {},
                "tests": {},
                "integrationTests": {}
            }
        };

        this._answers.paths.src = {
            "domain": path.join('src', 'domain', `${this._answers.solution}.Domain`),
            "application": path.join('src', 'domain', `${this._answers.solution}.Application`),
            "infrastructure": path.join('src', 'domain', `${this._answers.solution}.Infrastructure`),
            "rest": path.join('src', 'entrypoints', `${this._answers.solution}.Rest`),
            "grpc": path.join('src', 'entrypoints', `${this._answers.solution}.gRpc`),
            "asyncWorker": path.join('src', 'entrypoints', `${this._answers.solution}.AsyncWorker`)
        };

        this._answers.paths.tests = {
            "domain": path.join('tests', 'unit', `${this._answers.solution}.Domain.Test`),
            "application": path.join('tests', 'unit', `${this._answers.solution}.Application.Test`),
            "infrastructure": path.join('tests', 'unit', `${this._answers.solution}.Infrastructure.Test`),
            "rest": path.join('tests', 'unit', `${this._answers.solution}.Rest.Test`),
            "grpc": path.join('tests', 'unit', `${this._answers.solution}.gRpc.Test`),
            "asyncWorker": path.join('tests', 'unit', `${this._answers.solution}.AsyncWorker.Test`)
        };

        this._answers.paths.integrationTests = {
            "rest": path.join('tests', 'integration', `${this._answers.solution}.Rest.Test`),
            "grpc": path.join('tests', 'integration', `${this._answers.solution}.gRpc.Test`),
            "asyncWorker": path.join('tests', 'integration', `${this._answers.solution}.AsyncWorker.Test`)
        };
    }

    async generate() {        
        const generatorsMap = {
            'Aggregate': AggregateGenerator,
            // 'Domain Event': DomainEventGenerator,
            // 'Entity': EntityGenerator,
            // //Value Object
            // 'Repository': RepositoryGenerator,
            // //'Data Transfer Object': DtoGenerator,
            // 'Command': CommandGenerator,
            // 'Query': QueryGenerator,
            // 'Controller': ControllerGenerator
            // //Service
        };

        for (const key in generatorsMap) {
            const generator = new generatorsMap[key](this._utils, this._generator);

            await generator.generate(this._answers);
        }

        // {
        //     organization: 'CodeDesignPlus',
        //     microserviceName: 'Organization',
        //     aggregateName: 'Org',
        //     domainEvents: [ 'OrgCreated', 'OrgUpdated', 'OrgDeleted' ],
        //     entities: [ 'Stage' ],
        //     valueObjects: [ 'Name', 'Description' ],                             -> Pendiente crear Value Object
        //     createRepositoryForAggregate: true,
        //     commands: [ 'CreateOrg', 'UpdateOrg', 'DeleteOrg' ],
        //     queries: [ 'FindOrgById', 'GetAllOrgs' ],                            -> Pendiente crear DTO
        //     createControllerForAggregate: true,
        //     createServiceForAggregate: true                                      -> Pendiente crear Service      
        //   }
    }
}
