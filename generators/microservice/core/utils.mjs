import { findUp } from 'find-up';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import {
    AggregateModel,
    CommandHandlerModel,
    ControllerModel,
    DataTransferObjectModel,
    DomainEventModel,
    EntityModel,
    ProtoModel,
    QueryHandlerModel,
    RepositoryModel,
    ValueObjectModel,
    ConsumerModel
} from '../types/index.mjs';
import { AppSettingsModel } from '../types/appsettings.mjs';

export default class Utils {
    constructor(generator) {
        this._generator = generator;
    }

    async setPathBase() {
        const filePath = await findUp('archetype.json');

        if (!filePath) {
            return this._generator.destinationRoot();
        }

        const pathBaseDir = path.dirname(filePath);

        this._generator.destinationRoot(pathBaseDir);
    }

    async getOptions(answers) {
        const pathJson = path.join(this._generator.destinationRoot(), 'archetype.json');
        
        if (this._generator.options.template != 'microservice' && !fsSync.existsSync(pathJson))
            throw new Error('⚠️ File archetype.json not found, using the answers provided.');

        const archetypeValues = this._generator.fs.readJSON(pathJson);

        answers = {
            ...answers,
            organization: archetypeValues?.organization ?? answers.organization,
            microservice: archetypeValues?.microservice ?? answers.microservice,
            description: archetypeValues?.description ?? answers.description,
            organization: archetypeValues?.organization ?? answers.organization,
            aggregate: answers.aggregate ?? archetypeValues?.aggregate,
            vault: archetypeValues?.vault ?? answers.vault,
            contactName: archetypeValues?.contactName ?? answers.contactName,
            contactEmail: archetypeValues?.contactEmail ?? answers.contactEmail
        };

        const organization = this.toPascalCase(answers.organization);
        const microservice = this.toPascalCase(answers.microservice);

        const solution = `${organization}.Net.Microservice.${microservice}`;

        let options = {
            "organization": organization,
            "microservice": microservice,
            "solution": solution,
            "paths": {
                "src": {
                    "domain": path.join('src', 'domain', `${solution}.Domain`),
                    "application": path.join('src', 'domain', `${solution}.Application`),
                    "infrastructure": path.join('src', 'domain', `${solution}.Infrastructure`),
                    "rest": path.join('src', 'entrypoints', `${solution}.Rest`),
                    "grpc": path.join('src', 'entrypoints', `${solution}.gRpc`),
                    "asyncWorker": path.join('src', 'entrypoints', `${solution}.AsyncWorker`)
                },
                "tests": {
                    "domain": path.join('tests', 'unit', `${solution}.Domain.Test`),
                    "application": path.join('tests', 'unit', `${solution}.Application.Test`),
                    "infrastructure": path.join('tests', 'unit', `${solution}.Infrastructure.Test`),
                    "rest": path.join('tests', 'unit', `${solution}.Rest.Test`),
                    "grpc": path.join('tests', 'unit', `${solution}.gRpc.Test`),
                    "asyncWorker": path.join('tests', 'unit', `${solution}.AsyncWorker.Test`)
                },
                "integrationTests": {
                    "rest": path.join('tests', 'integration', `${solution}.Rest.Test`),
                    "grpc": path.join('tests', 'integration', `${solution}.gRpc.Test`),
                    "asyncWorker": path.join('tests', 'integration', `${solution}.AsyncWorker.Test`)
                }
            },
            "aggregate": AggregateModel.from(answers.aggregate),
            "domainEvents": DomainEventModel.from(answers.domainEvents),
            "entities": EntityModel.from(answers.entities),
            "valueObjects": ValueObjectModel.from(answers.valueObjects),
            "commands": CommandHandlerModel.from(answers.commands),
            "queries": QueryHandlerModel.from(answers.queries),
            "enableGrpc": answers.enableGrpc,
            "enableAsyncWorker": answers.enableAsyncWorker,
            "consumer": answers.enableAsyncWorker ? ConsumerModel.from(answers.consumer) : answers.consumer,
            "repository": RepositoryModel.from(answers.repository),
            "dataTransferObject": DataTransferObjectModel.from(answers.dataTransferObject),
            "controller": ControllerModel.from(answers.controller),
            "proto": ProtoModel.from(answers.protoName),
            "appSettings": AppSettingsModel.from(answers)
        };

        return options;
    }

    async addUsing(src, ns) {

        const filePath = path.join(this._generator.destinationRoot(), src, 'Usings.cs');

        let content = this._generator.fs.read(filePath);

        const lineToAdd = `global using ${ns};`;

        if (!content.includes(lineToAdd)) {
            content += `\n${lineToAdd}`;
            this._generator.fs.write(filePath, content, { flag: 'w', mode: 0o666 });
        }
    }

    async getClassName(path) {
        const content = this._generator.fs.read(path);

        const classNameMatch = content.match(/public class (\w+)/);
        const className = classNameMatch[1];

        return className;
    }

    toPascalCase = (str) =>
        str
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
            .join("");


    _getTransformations(options, namespace) {
        let transformations = [
            [/CodeDesignPlus\.Net\.Microservice(?!\.Commons)/g, namespace],
        ];

        if (options.entities.length === 0)
            transformations = [[/global using CodeDesignPlus\.Net\.Microservice\.Domain\.Entities;/g, ''], ...transformations];

        if (options.domainEvents.length === 0)
            transformations = [[/global using CodeDesignPlus\.Net\.Microservice\.Domain\.DomainEvents;/g, ''], ...transformations];

        return [
            [/public static void Configure\(\)\s*{\s*([^}]*)}/g, 'public static void Configure() { }'],
            [/<Protobuf Include="Protos\\org.proto" GrpcServices="Server" \/>/g, ''],
            [/Protos\\orders.proto/g, `Protos\\${options.proto?.file}`],
            [/global using CodeDesignPlus\.Net\.Microservice\.Domain\.Enums;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Domain\.DataTransferObjects;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Domain\.ValueObjects;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.AsyncWorker\.Consumers;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.AddProductToOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CancelOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CompleteOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.CreateOrder;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.RemoveProduct;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Commands\.UpdateQuantityProduct;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Queries\.FindOrderById;/g, ''],
            [/global using CodeDesignPlus\.Net\.Microservice\.Application\.Order\.Queries\.GetAllOrders;/g, ''],
            [/app\.MapGrpcService<OrdersService>\(\)/g, `app.MapGrpcService<${options.proto?.name}Service>()`],
            [/Order/g, options.aggregate.name],
            ...transformations
        ]
    }

    async generateFiles(options, namespace, template, destination, files) {
        const transformations = this._getTransformations(options, namespace);

        for (const i in files) {
            const file = files[i];
            const src = path.resolve(template, file);
            const dest = path.resolve(destination, file
                .replace(/CodeDesignPlus\.Net\.Microservice/g, namespace)
                .replace(/Order/g, options.microservice)
                .replace(/orders.proto/g, options.proto?.file)
            );

            const content = await fs.readFile(src, { encoding: 'utf-8' });

            let transformedContent = transformations.reduce((acc, [regex, replacement]) => acc.replace(regex, replacement), content);

            await fs.mkdir(path.dirname(dest), { recursive: true });
            await fs.writeFile(dest, transformedContent, { encoding: 'utf-8' });
        }
    }
}
