import { findUp } from 'find-up';
import path from 'path';
import { glob } from 'glob';

export default class Utils {
    constructor(generator) {
        this._generator = generator;
    }

    async setPathBase() {
        const filePath = await findUp('archetype.json');

        if (!filePath) {
            throw new Error('No se encontró el archivo archetype.json');
        }

        const pathBaseDir = path.dirname(filePath);

        this._generator.destinationRoot(pathBaseDir);
    }

    async readArchetypeMetadata() {
        const archetypeFile = await findUp('archetype.json');

        if (!archetypeFile) {
            throw new Error('No se encontró el archivo archetype.json');
        }

        return await this._generator.fs.readJSON(archetypeFile);
    }

    async getOptions(answers) {
        console.log('answers', answers);

        const options = {
            "organization": this._generator.answers.organization,
            "microserviceName": answers.microserviceName,
            "aggregateName": answers.aggregateName?.replace(/(Aggregate|Entity)/g, ''),
            "domainEvents": answers.domainEvents?.split(',').map(x => x.trim()) ?? [],
            "entities": answers.entities?.split(',').map(x => x.trim()) ?? [],
            "valueObjects": answers.valueObjects?.split(',').map(x => x.trim()) ?? [],
            "createRepositoryForAggregate": answers.repository,
            "commands": answers.commands?.split(',').map(x => x.trim()) ?? [],
            "queries": answers.queries?.split(',').map(x => x.trim()) ?? [],
            "createControllerForAggregate": answers.controller,
            "createServiceForAggregate": answers.service,
            "solution": `${this._generator.answers.organization}.Net.Microservice.${answers.microserviceName}`,
            "paths": {
                "src": {},
                "tests": {},
                "integrationTests": {}
            },
            "repository": answers.repository?.replace(/(Aggregate|Entity)/g, ''),
            "dataTransferObject": answers.dataTransferObject?.replace(/(Aggregate|Entity|Dto)/g, ''),
            "controller": answers.controller?.replace(/(Aggregate|Entity)/g, ''),
            "proto": answers.proto?.replace(/(Aggregate|Entity)/g, '')
        };

        options.paths.src = {
            "domain": path.join('src', 'domain', `${options.solution}.Domain`),
            "application": path.join('src', 'domain', `${options.solution}.Application`),
            "infrastructure": path.join('src', 'domain', `${options.solution}.Infrastructure`),
            "rest": path.join('src', 'entrypoints', `${options.solution}.Rest`),
            "grpc": path.join('src', 'entrypoints', `${options.solution}.gRpc`),
            "asyncWorker": path.join('src', 'entrypoints', `${options.solution}.AsyncWorker`)
        };


        options.paths.tests = {
            "domain": path.join('tests', 'unit', `${options.solution}.Domain.Test`),
            "application": path.join('tests', 'unit', `${options.solution}.Application.Test`),
            "infrastructure": path.join('tests', 'unit', `${options.solution}.Infrastructure.Test`),
            "rest": path.join('tests', 'unit', `${options.solution}.Rest.Test`),
            "grpc": path.join('tests', 'unit', `${options.solution}.gRpc.Test`),
            "asyncWorker": path.join('tests', 'unit', `${options.solution}.AsyncWorker.Test`)
        };

        options.paths.integrationTests = {
            "rest": path.join('tests', 'integration', `${options.solution}.Rest.Test`),
            "grpc": path.join('tests', 'integration', `${options.solution}.gRpc.Test`),
            "asyncWorker": path.join('tests', 'integration', `${options.solution}.AsyncWorker.Test`)
        };

        return options;
    }

    async addUsing(src, ns) {

        const filePath = path.join(this._generator.destinationRoot(), src, 'Usings.cs');

        let content = this._generator.fs.read(filePath);

        const lineToAdd = `global using ${ns};`;

        if (!content.includes(lineToAdd)) {
            content += `\n${lineToAdd}`;
            this._generator.fs.write(filePath, content, { flag:'w', mode: 0o666 });
        }
    }

    async getClassName(path) {
        const content = this._generator.fs.read(path);

        const classNameMatch = content.match(/public class (\w+)/);
        const className = classNameMatch[1];

        return className;
    }
}