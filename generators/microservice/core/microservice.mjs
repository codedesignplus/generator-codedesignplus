import { glob } from 'glob';
import path from 'path';
import replace from 'gulp-replace';
import { makeDirectory } from 'make-dir';
import ErrorsGenerator from './errors.mjs';
import WizardGenerator from './wizard.mjs';
import fs from 'fs/promises';

export default class MicroserviceGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this._errorGenerator = new ErrorsGenerator(utils, generator);
        this._wizard = new WizardGenerator(utils, generator);
    }

    async prompt(defaultValues) {
        const answersMicroservice = await this._generator.prompt([
            {
                type: 'confirm',
                name: 'enableExample',
                message: 'Would you like to include an example?',
            }
        ]);

        let answers = {
            enableExample: answersMicroservice.enableExample,
        };

        if (!answers.enableExample) {
            const answersWizard = await this._wizard.prompt(defaultValues);

            answers = {
                ...answers,
                ...answersWizard
            }
        }

        return answers;
    }

    async generate(options) {
        const namespace = `${options.organization}.Net.Microservice.${options.microserviceName}`;

        const template = this._generator.templatePath('microservice');

        const destination = path.join(this._generator.destinationRoot(), namespace);

        const ignores = ['**/bin/**', '**/obj/**'];

        if (!options.enableExample) {
            this._ignoreFilesExample(ignores);
        }

        const files = glob.sync('**', { dot: true, nodir: true, cwd: template, ignore: ignores });

        for (const i in files) {
            const file = files[i];
            const src = path.resolve(template, file);
            const dest = path.resolve(destination, file.replace(/CodeDesignPlus\.Net\.Microservice/g, namespace).replace(/Order/g, options.microserviceName));

            const content = await fs.readFile(src, {
                encoding: 'utf-8'
            });

            let transformedContent = content
                .replace(/<Protobuf Include="Protos\\org.proto" GrpcServices="Server" \/>/g, ``)
                .replace(/Protos\\orders.proto/g, `Protos\\${options.proto.file}`)
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Domain\.Enums;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Domain\.DataTransferObjects;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.AsyncWorker\.Consumers;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.AddProductToOrder;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CancelOrder;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CompleteOrder;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CreateOrder;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.RemoveProduct;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.UpdateQuantityProduct;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Queries\.FindOrderById;/g, '')
                .replace(/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Queries\.GetAllOrders;/g, '')
                .replace(/app\.MapGrpcService<OrdersService>\(\)/g, `app.MapGrpcService<${options.proto.name}Service>()`)
                .replace(/CodeDesignPlus\.Net\.Microservice(?!\.Commons)/g, namespace)
                .replace(/public static void Configure\(\)\s*{\s*([^}]*)}/g, 'public static void Configure() { }')
                .replace(/\.Order\./g, `.${options.aggregate.name}.`);
        


            await fs.mkdir(path.dirname(dest), { recursive: true });
            await fs.writeFile(dest, transformedContent, {
                encoding: 'utf-8'
            });
        }

        // if (!options.enableExample) {
        //     await this._createEmptyFolders(destination, options.microserviceName);
        // }

        await this._generator.fs.writeJSON(`${destination}/archetype.json`, {
            "microservice": options.microserviceName,
            "description": "Custom Microservice",
            "version": "1.0.0",
            "organization": options.organization
        }, { spaces: 2 });

        await this._errorGenerator.internalGenerate(path.join(destination, 'src', 'domain', `${namespace}.Domain`), 'Domain', options);
        await this._errorGenerator.internalGenerate(path.join(destination, 'src', 'domain', `${namespace}.Application`), 'Application', options);
        await this._errorGenerator.internalGenerate(path.join(destination, 'src', 'domain', `${namespace}.Infrastructure`), 'Infrastructure', options);

        this._generator.destinationRoot(destination);

        await this._wizard.generate(options);
    }


    _ignoreFilesExample(ignores) {
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
    }

    _createEmptyFolders(destination, microserviceName) {
        const baseNamespace = `CodeDesignPlus.Net.Microservice.${microserviceName}`;
        const applicationPath = path.join(destination, 'src', 'domain', `${baseNamespace}.Application`, microserviceName);
        const domainPath = path.join(destination, 'src', 'domain', `${baseNamespace}.Domain`);
        const infrastructurePath = path.join(destination, 'src', 'domain', `${baseNamespace}.Infrastructure`);
        const entrypointsPath = path.join(destination, 'src', 'entrypoints', `${baseNamespace}`);
        const testsIntegrationPath = path.join(destination, 'tests', 'integration', `${baseNamespace}`);
        const testsUnitPath = path.join(destination, 'tests', 'unit', `${baseNamespace}`);

        return Promise.all([
            makeDirectory(path.join(applicationPath, 'Commands')),
            makeDirectory(path.join(applicationPath, 'Queries')),
            makeDirectory(path.join(applicationPath, 'DataTransferObjects')),
            makeDirectory(path.join(domainPath, 'DataTransferObjects')),
            makeDirectory(path.join(domainPath, 'Enums')),
            makeDirectory(path.join(domainPath, 'Repositories')),
            makeDirectory(path.join(domainPath, 'Entities')),
            makeDirectory(path.join(domainPath, 'DomainEvents')),
            makeDirectory(path.join(domainPath, 'ValueObjects')),
            makeDirectory(path.join(infrastructurePath, 'Repositories')),
            makeDirectory(path.join(`${entrypointsPath}.AsyncWorker`, 'Consumers')),
            makeDirectory(path.join(`${entrypointsPath}.gRpc`, 'Protos')),
            makeDirectory(path.join(`${entrypointsPath}.gRpc`, 'Services')),
            makeDirectory(path.join(`${entrypointsPath}.Rest`, 'Controllers')),
            makeDirectory(path.join(`${testsIntegrationPath}.AsyncWorker.Test`, 'Consumers')),
            makeDirectory(path.join(`${testsIntegrationPath}.gRpc.Test`, 'Protos')),
            makeDirectory(path.join(`${testsIntegrationPath}.gRpc.Test`, 'Services')),
            makeDirectory(path.join(`${testsIntegrationPath}.Rest.Test`, 'Controllers')),
            makeDirectory(path.join(`${testsUnitPath}.Application.Test`, microserviceName, 'Commands')),
            makeDirectory(path.join(`${testsUnitPath}.Application.Test`, microserviceName, 'Queries')),
            makeDirectory(path.join(`${testsUnitPath}.Application.Test`, microserviceName, 'DataTransferObjects')),
            makeDirectory(path.join(`${testsUnitPath}.Infrastructure.Test`, 'Repositories')),
            makeDirectory(path.join(`${testsUnitPath}.Domain.Test`, 'DataTransferObjects')),
            makeDirectory(path.join(`${testsUnitPath}.Domain.Test`, 'Enums')),
            makeDirectory(path.join(`${testsUnitPath}.Domain.Test`, 'Repositories')),
            makeDirectory(path.join(`${testsUnitPath}.Domain.Test`, 'Entities')),
            makeDirectory(path.join(`${testsUnitPath}.Domain.Test`, 'DomainEvents')),
            makeDirectory(path.join(`${testsUnitPath}.AsyncWorker.Test`, 'Consumers')),
            makeDirectory(path.join(`${testsUnitPath}.gRpc.Test`, 'Services')),
            makeDirectory(path.join(`${testsUnitPath}.Rest.Test`, 'Controllers'))
        ]);
    }
}
