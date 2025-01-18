import { glob } from 'glob';
import path from 'path';
import ErrorsGenerator from './errors.mjs';
import AppSettingsGenerator from './appsettings.mjs';
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

import fs from 'fs/promises';
import { toPascalCase } from '../types/base.mjs';

export default class MicroserviceGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this._errorGenerator = new ErrorsGenerator(utils, generator);
        this._appsettings = new AppSettingsGenerator(utils, generator);
        this._consumerGenerator = new ConsumerGenerator(utils, generator);
        this._protoGenerator = new ProtoGenerator(utils, generator);
        this.name = 'microservice';
    }

    getArguments() {
        this._generator.option('is-crud', { type: Boolean, alias: 'ic', required: false, description: 'Indicates that the microservice will be a CRUD, generating the basic structure for data management operations.' });
        this._generator.option('enable-rest', { type: Boolean, alias: 'er', required: true, description: 'Enables the REST API for the microservice, allowing communication through HTTP requests.' });
        this._generator.option('enable-grpc', { type: Boolean, alias: 'eg', required: true, description: 'Enables the gRPC API for the microservice, which offers a high-performance communication protocol.' });
        this._generator.option('enable-async-worker', { type: Boolean, alias: 'eaw', required: true, description: 'Enables an asynchronous worker for handling background tasks and events, improving scalability.' });
        this._generator.option('aggregate', { type: String, alias: 'a', required: true, description: 'The name of the microservice\'s root aggregate, essential for domain organization.' });
                
        this._appsettings.getArguments();
        
        if (this._generator.options.enableAsyncWorker)
            this._consumerGenerator.getArguments();
        
        const aggregate = toPascalCase(this._generator.options.aggregate);
        
        this._generator.options = {
            ...this._generator.options,
            aggregate: aggregate,
            domainEvents: `${aggregate}Created, ${aggregate}Updated, ${aggregate}Deleted`,
            commands: `Create${aggregate}, Update${aggregate}, Delete${aggregate}`,
            queries: `Get${aggregate}ById, GetAll${aggregate}`,
        }
        if (!this._generator.options.isCrud) {
            this._generator.option('domainEvents', { type: String, alias: 'de', required: true, description: 'Comma-separated list of domain events, fundamental in asynchronous communication between microservices.' });
            this._generator.option('entities', { type: String, alias: 'e', required: true, description: 'Comma-separated list of entities.' });
            this._generator.option('commands', { type: String, alias: 'cs', required: false, description: 'Comma-separated list of commands representing actions from the user or system.' });
            this._generator.option('queries', { type: String, alias: 'q', required: false, description: 'Comma-separated list of queries, representing requests for information from the system.' });
        }
        
        this._generator.options = {
            ...this._generator.options,
            repository: aggregate,
            controller: aggregate,
            dataTransferObject: aggregate,
            protoName: aggregate
        }
    }

    async generate(options) {
        const namespace = `${options.organization}.Net.Microservice.${options.microservice}`;

        const template = this._generator.templatePath('microservice');

        const destination = path.join(this._generator.destinationRoot(), namespace);

        const ignores = this._getIgnores();

        const files = glob.sync('**', { dot: true, nodir: true, cwd: template, ignore: ignores });

        await this._utils.generateFiles(options, namespace, template, destination, files);

        this._generator.destinationRoot(destination);

        await this._errorGenerator.generate(options);

        await this._appsettings.generate(options);


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

        await this._createMetadataFile(destination, options);
    }

    async _createMetadataFile(destination, options) {
        await this._generator.fs.writeJSON(`${destination}/archetype.json`, {
            "microservice": options.microservice,
            "description": "Custom Microservice",
            "version": "1.0.0",
            "organization": options.organization,
            "aggregate": options.aggregate.name,
            "vault": options.appSettings.vault,
            "contactName": options.appSettings.contact.name,
            "contactEmail": options.appSettings.contact.email
        }, { spaces: 2 });
    }

    _getIgnores() {
        const ignores = ['**/bin/**', '**/obj/**'];

        const items = {
            domain_application: [
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Errors.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/AddProductToOrder/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/CancelOrder/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/CompleteOrder/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/CreateOrder/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/RemoveProduct/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/UpdateQuantityProduct/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/AddProductToOrder/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Queries/FindOrderById/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Queries/GetAllOrders/**',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/*.cs',
            ],
            domain_domain: [
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Errors.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/DataTransferObjects/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/DomainEvents/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Entities/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Enums/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Repositories/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/ValueObjects/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/OrderAggregate.cs',
            ],
            domain_infrastructure: [
                'src/domain/CodeDesignPlus.Net.Microservice.Infrastructure/Repositories/OrderRepository.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Infrastructure/Errors.cs'
            ],
            entryPoints_asyncWorker: [
                'src/entrypoints/CodeDesignPlus.Net.Microservice.AsyncWorker/Consumers/**'
            ],
            entryPoints_gRpc: [
                'src/entrypoints/CodeDesignPlus.Net.Microservice.gRpc/Protos/*.proto',
                'src/entrypoints/CodeDesignPlus.Net.Microservice.gRpc/Services/*.cs'
            ],
            entryPoints_Rest: [
                'src/entrypoints/CodeDesignPlus.Net.Microservice.Rest/Controllers/**'
            ],
            integrationTest_asyncWorker: [
                'tests/integration/CodeDesignPlus.Net.Microservice.AsyncWorker.Test/Consumers/**'
            ],
            integrationTest_gRpc: [
                'tests/integration/CodeDesignPlus.Net.Microservice.gRpc.Test/Protos/**',
                'tests/integration/CodeDesignPlus.Net.Microservice.gRpc.Test/Services/**'
            ],
            integrationTest_rest: [
                'tests/integration/CodeDesignPlus.Net.Microservice.Rest.Test/Controllers/**'
            ],
            unitTest_application: [
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/AddProductToOrder/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/CancelOrder/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/CompleteOrder/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/CreateOrder/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/RemoveProduct/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/UpdateQuantityProduct/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Queries/FindOrderById/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Queries/GetAllOrders/**',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/DataTransferObjects/ClientDto.cs',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/DataTransferObjects/OrderDto.cs',
                'tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/DataTransferObjects/ProductDto.cs',
            ],
            unitTest_domain: [
                'tests/unit/CodeDesignPlus.Net.Microservice.Domain.Test/DomainEvents/*.cs',
                'tests/unit/CodeDesignPlus.Net.Microservice.Domain.Test/OrderAggregateTest.cs',
            ],
            unitTest_infrastructure: [
                'tests/unit/CodeDesignPlus.Net.Microservice.Infrastructure.Test/Repositories/*.cs',
            ],
            unitTest_asyncWorker: [
                'tests/unit/CodeDesignPlus.Net.Microservice.AsyncWorker.Test/Consumers/*.cs',
            ],
            unitTest_gRpc: [
                'tests/unit/CodeDesignPlus.Net.Microservice.gRpc.Test/Services/*.cs',
            ],
            unitTest_rest: [
                'tests/unit/CodeDesignPlus.Net.Microservice.Rest.Test/Controllers/*.cs',
            ]
        }

        for (const key in items) {
            ignores.push(...items[key]);
        }

        return ignores;
    }
}
