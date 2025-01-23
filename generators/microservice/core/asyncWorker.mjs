import path from 'path';
import AppSettingsGenerator from './appsettings.mjs';
import ConsumerGenerator from './consumer.mjs';
import fsSync from 'fs';
import fs from 'fs/promises';
import { glob } from 'glob';

export default class AsyncWorkerGenerator {

    constructor(utils, generator) {
        this._appsettings = new AppSettingsGenerator(utils, generator);
        this._consumerGenerator = new ConsumerGenerator(utils, generator);

        this._utils = utils;
        this._generator = generator;
        this.name = 'grpc';
    }

    async generate(options) {
        options = {
            ...options
        }        

        const destination = this._generator.destinationPath();

        const asyncWorkerProjectPathDestination = path.join(destination, options.paths.src.asyncWorker);
        const asyncWorkerTestProjectPathDestination = path.join(destination, options.paths.tests.asyncWorker);
        const asyncWorkerIntegrationTestProjectPathDestination = path.join(destination, options.paths.integrationTests.asyncWorker);

        const ignores = this._getIgnores();

        if (!fsSync.existsSync(asyncWorkerProjectPathDestination)) {
            const templateAsyncWorkerProject = this._generator.templatePath('microservice/src/entrypoints/CodeDesignPlus.Net.Microservice.AsyncWorker');

            await this._generateFiles(templateAsyncWorkerProject, ignores, options, asyncWorkerProjectPathDestination);
        }

        if (!fsSync.existsSync(asyncWorkerTestProjectPathDestination)) {
            const templateAsyncWorkerProject = this._generator.templatePath('microservice/tests/unit/CodeDesignPlus.Net.Microservice.AsyncWorker.Test');

            await this._generateFiles(templateAsyncWorkerProject, ignores, options, asyncWorkerTestProjectPathDestination);
        }

        if (!fsSync.existsSync(asyncWorkerIntegrationTestProjectPathDestination)) {
            const templateAsyncWorkerProject = this._generator.templatePath('microservice/tests/integration/CodeDesignPlus.Net.Microservice.AsyncWorker.Test');

            await this._generateFiles(templateAsyncWorkerProject, ignores, options, asyncWorkerIntegrationTestProjectPathDestination);
        }

        
        this._consumerGenerator.generate(options);
        
        await this._generator.spawnCommand('dotnet', ['sln', `${destination}/${options.solution}.sln`, 'add', `${asyncWorkerProjectPathDestination}`, '--solution-folder', 'src/entrypoints']);
        await this._generator.spawnCommand('dotnet', ['sln', `${destination}/${options.solution}.sln`, 'add', `${asyncWorkerTestProjectPathDestination}`, '--solution-folder', 'tests/unit']);
        await this._generator.spawnCommand('dotnet', ['sln', `${destination}/${options.solution}.sln`, 'add', `${asyncWorkerIntegrationTestProjectPathDestination}`, '--solution-folder', 'tests/integration']);
    }

    async _generateFiles(templateAsyncWorkerProject, ignores, options, asyncWorkerProjectPathDestination) {
        
        const files = glob.sync('**', { dot: true, nodir: true, cwd: templateAsyncWorkerProject, ignore: ignores });

        await this._utils.generateFiles(options, options.solution, templateAsyncWorkerProject, asyncWorkerProjectPathDestination, files);

        await this._appsettings.generate(options, [options.paths.src.asyncWorker]);
    }

    getArguments() {
        this._consumerGenerator.getArguments();
    }

    _getIgnores() {
        const ignores = [
            '**/bin/**', 
            '**/obj/**',  
            '**/Consumers/**'
        ];

        return ignores;
    }
}
