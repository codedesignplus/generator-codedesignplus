import { glob } from 'glob';
import path from 'path';
import ErrorsGenerator from './errors.mjs';
import WizardGenerator from './wizard.mjs';
import fs from 'fs/promises';

export default class MicroserviceGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this._errorGenerator = new ErrorsGenerator(utils, generator);
        this._wizard = new WizardGenerator(utils, generator);
        this.name = 'microservice';
    }

    getArguments() {
        this._generator.option('isExample', { type: Boolean, required: false, default: false, description: 'Indicates if a functional example should be included in the microservice.' });

        if (this._generator.options.isExample)
            return

        this._wizard.getArguments();
    }


    async prompt(defaultValues) {
        const { isExample } = await this._generator.prompt([
            {
                type: 'confirm',
                name: 'isExample',
                message: 'Would you like to include an example?',
            }
        ]);

        if (isExample)
            return {
                isExample: isExample
            }

        const answersWizard = await this._wizard._prompt(defaultValues);

        return {
            isExample: isExample,
            ...answersWizard
        }
    }

    async generate(options) {
        const namespace = `${options.organization}.Net.Microservice.${options.microservice}`;

        const template = this._generator.templatePath('microservice');

        const destination = path.join(this._generator.destinationRoot(), namespace);

        const ignores = this._getIgnores(options.isExample);

        const files = glob.sync('**', { dot: true, nodir: true, cwd: template, ignore: ignores });

        await this._generateFiles(options, namespace, template, destination, files);

        if (!options.isExample) {
            this._generator.destinationRoot(destination);

            await this._errorGenerator.generate(options);

            await this._wizard.generate(options);
        }

        await this._createMetadataFile(destination, options);
    }

    async _generateFiles(options, namespace, template, destination, files) {
        const transformations = this._getTransformations(options, namespace);

        for (const i in files) {
            const file = files[i];
            const src = path.resolve(template, file);
            const dest = path.resolve(destination, file.replace(/CodeDesignPlus\.Net\.Microservice/g, namespace).replace(/Order/g, options.microservice));

            const content = await fs.readFile(src, { encoding: 'utf-8' });

            let transformedContent = transformations.reduce((acc, [regex, replacement]) => acc.replace(regex, replacement), content);

            await fs.mkdir(path.dirname(dest), { recursive: true });
            await fs.writeFile(dest, transformedContent, { encoding: 'utf-8' });
        }
    }

    async _createMetadataFile(destination, options) {
        await this._generator.fs.writeJSON(`${destination}/archetype.json`, {
            "microservice": options.microservice,
            "description": "Custom Microservice",
            "version": "1.0.0",
            "organization": options.organization
        }, { spaces: 2 });
    }

    _getTransformations(options, namespace) {
        let transformations = [
            [/CodeDesignPlus\.Net\.Microservice(?!\.Commons)/g, namespace],
        ];

        if (options.isExample)
            return transformations;

        if (options.entities.length === 0)
            transformations = [[/global using CodeDesignPlus\.Net\.Microservice\.Domain\.Entities;/g, ''], ...transformations];

        if (options.domainEvents.length === 0)
            transformations = [[/global using CodeDesignPlus\.Net\.Microservice\.Domain\.DomainEvents;/g, ''], ...transformations];

        return [
            [/public static void Configure\(\)\s*{\s*([^}]*)}/g, 'public static void Configure() { }'],
            [/<Protobuf Include="Protos\\org.proto" GrpcServices="Server" \/>/g, ''],
            [/Protos\\orders.proto/g, `Protos\\${options.proto.file}`],
            [/global using CodeDesignPlus\.Net\.Microservice\.Domain\.Enums;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Domain\.DataTransferObjects;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.AsyncWorker\.Consumers;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.AddProductToOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CancelOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CompleteOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CreateOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.RemoveProduct;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.UpdateQuantityProduct;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Queries\.FindOrderById;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Queries\.GetAllOrders;/g, ''],
            [/app\.MapGrpcService<OrdersService>\(\)/g, `app.MapGrpcService<${options.proto.name}Service>()`],
            [/Order/g, options.aggregate.name],
            ...transformations
        ]
    }

    _getIgnores(isExample) {
        const ignores = ['**/bin/**', '**/obj/**'];

        if (isExample)
            return ignores;

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
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/ClientDto.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/OrderDto.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/ProductDto.cs',
            ],
            domain_domain: [
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Errors.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/DataTransferObjects/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/DomainEvents/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Entities/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Enums/*.cs',
                'src/domain/CodeDesignPlus.Net.Microservice.Domain/Repositories/*.cs',
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
