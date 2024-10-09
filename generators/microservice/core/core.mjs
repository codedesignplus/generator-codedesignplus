import AggregateGenerator from './aaggregate.mjs';
import CommandGenerator from './command.mjs';
import QueryGenerator from './query.mjs';
import ConsumerGenerator from './consumer.mjs';
import ControllerGenerator from './controller.mjs';
import DtoGenerator from './dataTransferObject.mjs';
import DomainEventGenerator from './domainEvent.mjs';
import EntityGenerator from './entity.mjs';
import RepositoryGenerator from './repository.mjs';
import MicroserviceGenerator from './microservice.mjs';
import UseCaseGenerator from './useCase.mjs';

export default class Core {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }


    async prompt() {
        let content = {};

        try {
            content = await this._utils.readArchetypeMetadata();
        }
        catch (error) {
            content = {
                organization: 'CodeDesignPlus'
            };
        }

        this._generator.answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'organization',
                message: 'Your organization name',
                default: content.organization,
            },
            {
                type: 'list',
                name: 'resource',
                message: 'Select the resource create:',
                choices: [
                    'Use Case',
                    'Aggregate',
                    'Async Worker',
                    'Microservice',
                    'Command',
                    'Consumer',
                    'Controller',
                    'Data Transfer Object',
                    'Domain Event',
                    'Entity',
                    'gRpc',
                    'Query',
                    'Repository',
                    'Rest',
                    'Value Object'
                ],
            }
        ]);

        const generatorsMap = {
            'Use Case': UseCaseGenerator,
            'Microservice': MicroserviceGenerator,
            'Domain Event': DomainEventGenerator,
            'Entity': EntityGenerator,
            'Data Transfer Object': DtoGenerator,
            'Repository': RepositoryGenerator,
            'Aggregate': AggregateGenerator,
            'Command': CommandGenerator,
            'Query': QueryGenerator,
            'Consumer': ConsumerGenerator,
            'Controller': ControllerGenerator
        };

        const selectedResource = this._generator.answers.resource;
        const generatorClass = generatorsMap[selectedResource];

        if (!generatorClass)
            throw new Error(`The resource ${selectedResource} is not supported`);

        const generatorInstance = new generatorClass(this._utils, this._generator);
        await generatorInstance.prompt();

        this.generator = generatorInstance;
    }
}