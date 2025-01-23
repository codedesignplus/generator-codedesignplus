import path from 'path';
import AppSettingsGenerator from './appsettings.mjs';
import ProtoGenerator from './proto.mjs';
import fsSync from 'fs';
import { glob } from 'glob';
import { ProtoModel } from '../types/index.mjs';

export default class GrpcGenerator {

    constructor(utils, generator) {
        this._appsettings = new AppSettingsGenerator(utils, generator);
        this._protoGenerator = new ProtoGenerator(utils, generator);

        this._utils = utils;
        this._generator = generator;
        this.name = 'grpc';
    }

    async generate(options) {
        options = {
            ...options,
            proto: ProtoModel.from(options.aggregate.name)
        }        

        const destination = this._generator.destinationPath();

        const grpcProjectPathDestination = path.join(destination, options.paths.src.grpc);
        const grpcTestProjectPathDestination = path.join(destination, options.paths.tests.grpc);
        const grpcIntegrationTestProjectPathDestination = path.join(destination, options.paths.integrationTests.grpc);

        const ignores = this._getIgnores();

        if (!fsSync.existsSync(grpcProjectPathDestination)) {
            const templateGrpcProject = this._generator.templatePath('microservice/src/entrypoints/CodeDesignPlus.Net.Microservice.gRpc');

            await this._generateFiles(templateGrpcProject, ignores, options, grpcProjectPathDestination);
        }

        if (!fsSync.existsSync(grpcTestProjectPathDestination)) {
            const templateGrpcProject = this._generator.templatePath('microservice/tests/unit/CodeDesignPlus.Net.Microservice.gRpc.Test');

            await this._generateFiles(templateGrpcProject, ignores, options, grpcTestProjectPathDestination);
        }

        if (!fsSync.existsSync(grpcIntegrationTestProjectPathDestination)) {
            const templateGrpcProject = this._generator.templatePath('microservice/tests/integration/CodeDesignPlus.Net.Microservice.gRpc.Test');

            await this._generateFiles(templateGrpcProject, ignores, options, grpcIntegrationTestProjectPathDestination);
        }
        
        this._protoGenerator.generate(options);

        await this._generator.spawnCommand('dotnet', ['sln', `${destination}/${options.solution}.sln`, 'add', `${grpcProjectPathDestination}`, '--solution-folder', 'src/entrypoints']);
        await this._generator.spawnCommand('dotnet', ['sln', `${destination}/${options.solution}.sln`, 'add', `${grpcTestProjectPathDestination}`, '--solution-folder', 'tests/unit']);
        await this._generator.spawnCommand('dotnet', ['sln', `${destination}/${options.solution}.sln`, 'add', `${grpcIntegrationTestProjectPathDestination}`, '--solution-folder', 'tests/integration']);
    }

    async _generateFiles(templateGrpcProject, ignores, options, grpcProjectPathDestination) {
        
        const files = glob.sync('**', { dot: true, nodir: true, cwd: templateGrpcProject, ignore: ignores });

        console.log(templateGrpcProject, files);

        await this._utils.generateFiles(options, options.solution, templateGrpcProject, grpcProjectPathDestination, files);

        await this._appsettings.generate(options, [options.paths.src.grpc]);
    }

    getArguments() {
        this._generator.options = {
            ...this._generator.options,
            enableGrpc: "true"
        }
    }

    _getIgnores() {
        const ignores = [
            '**/bin/**', 
            '**/obj/**',
            '**/Protos/**',
            '**/Services/**'
        ];

        return ignores;
    }
}
