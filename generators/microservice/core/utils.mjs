import { findUp } from 'find-up';
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

    async readArchetypeMetadata() {
        const archetypeFile = await findUp('archetype.json');

        if (!archetypeFile)
            throw new Error('No se encontró el archivo archetype.json');

        return await this._generator.fs.readJSON(archetypeFile);
    }

    async getOptions(answers) {
        
        const organization = this.toPascalCase(answers.template ? answers.organization : this._generator.answers.organization);
        const microservice = this.toPascalCase(answers.template ? answers.microservice : this._generator.answers.microservice);

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
            "enableRest": answers.enableRest,
            "enableGrpc": answers.enableGrpc,
            "enableAsyncWorker": answers.enableAsyncWorker,
            "consumer": answers.enableAsyncWorker ? ConsumerModel.from(answers.consumer) : answers.consumer,
            "repository": RepositoryModel.from(answers.repository),
            "dataTransferObject": DataTransferObjectModel.from(answers.dataTransferObject),
            "controller": ControllerModel.from(answers.controller),
            "proto": ProtoModel.from(answers.protoName),
            "appSettings": AppSettingsModel.from(answers, microservice, organization)
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
}
