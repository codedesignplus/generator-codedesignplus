import Generator from 'yeoman-generator';
import { glob } from 'glob';
import path from 'path';
import replace from 'gulp-replace';
import { makeDirectory } from 'make-dir';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.argument('name', { type: String, required: false });
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'organization',
                message: 'Your organization name',
                default: 'CodeDesignPlus',
                store: true,
            },
            {
                type: 'input',
                name: 'name',
                message: 'Your resource name',
                default: this.name,
                store: true,
            },
            {
                type: 'list',
                name: 'resource',
                message: 'Select the resource create:',
                choices: [
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
            }]);

        if (this.answers.resource === 'Microservice') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'confirm',
                    name: 'enableExample',
                    message: 'Would you like to include an example?',
                    default: '',
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }
    }

    writing() {

        switch (this.answers.resource) {
            case 'Aggregate':
                this._writingAggregate()
                break;
            case 'Async Worker':
                this._writingAsyncWorker()
                break;
            case 'Microservice':
                this._writingMicroservice()
                break;
            case 'Command':
                this._writingCommand()
                break;
            case 'Consumer':
                this._writingConsumer()
                break;
            case 'Controller':
                this._writingController()
                break;
            case 'Data Transfer Object':
                this._writingDataTransferObject()
                break;
            case 'Domain Event':
                this._writingDomainEvent()
                break;
            case 'Entity':
                this._writingEntity()
                break;
            case 'gRpc':
                this._writinggRpc()
                break;
            case 'Query':
                this._writingQuery()
                break;
            case 'Repository':
                this._writingRepository()
                break;
            case 'Rest':
                this._writingRest()
                break;
            case 'Value Object':
                this._writingValueObject()
                break;
        }
    }

    _writingAggregate() {
        this.fs.copyTpl(
            this.templatePath('aggregate'),
            this.destinationPath('src/domain/Aggregate')
        );
    }

    _writingAsyncWorker() {
        this.fs.copyTpl(
            this.templatePath('async-worker'),
            this.destinationPath('src/entrypoints/AsyncWorker')
        );
    }

    async _writingMicroservice() {
        const namespace = `${this.answers.organization}.Net.Microservice.${this.answers.name}`;

        const template = this.templatePath('microservice');

        const destination = path.join(this.destinationRoot(), namespace);

        const replaceStreamNamespace = replace(/CodeDesignPlus\.Net\.Microservice(?!\.Commons)/g, namespace);

        this.queueTransformStream(replaceStreamNamespace);

        const ignores = ['**/bin/**', '**/obj/**'];

        if (!this.answers.enableExample) {
            this._ignoreFilesExample(ignores);
        }

        const files = glob.sync('**', { dot: true, nodir: true, cwd: template, ignore: ignores });

        for (const i in files) {

            const src = path.resolve(template, files[i]);
            const dest = path.resolve(destination, files[i].replace(/CodeDesignPlus\.Net\.Microservice/g, namespace).replace(/Order/g, this.answers.name));

            this.fs.copy(src, dest, { overwrite: false, errorOnExist: true });
        }

        if (!this.answers.enableExample) {
            await this._createEmptyFolders();
        }

    }

    _writingCommand() {
        this.fs.copyTpl(
            this.templatePath('command'),
            this.destinationPath('src/domain/Commands')
        );
    }

    _writingConsumer() {
        this.fs.copyTpl(
            this.templatePath('consumer'),
            this.destinationPath('src/entrypoints/AsyncWorker/Consumers')
        );
    }

    _writingController() {
        this.fs.copyTpl(
            this.templatePath('controller'),
            this.destinationPath('src/entrypoints/Rest/Controllers')
        );
    }

    _writingDataTransferObject() {
        this.fs.copyTpl(
            this.templatePath('data-transfer-object'),
            this.destinationPath('src/domain/DataTransferObjects')
        );
    }

    _writingDomainEvent() {
        this.fs.copyTpl(
            this.templatePath('domain-event'),
            this.destinationPath('src/domain/DomainEvents')
        );
    }

    _writingEntity() {
        this.fs.copyTpl(
            this.templatePath('entity'),
            this.destinationPath('src/domain/Entities')
        );
    }

    _writinggRpc() {
        this.fs.copyTpl(
            this.templatePath('grpc'),
            this.destinationPath('src/entrypoints/gRpc')
        );
    }

    _writingQuery() {
        this.fs.copyTpl(
            this.templatePath('query'),
            this.destinationPath('src/domain/Queries')
        );
    }

    _writingRepository() {
        this.fs.copyTpl(
            this.templatePath('repository'),
            this.destinationPath('src/domain/Repositories')
        );
    }

    _writingRest() {
        this.fs.copyTpl(
            this.templatePath('rest'),
            this.destinationPath('src/entrypoints/Rest')
        );
    }

    _writingValueObject() {
        this.fs.copyTpl(
            this.templatePath('value-object'),
            this.destinationPath('src/domain/ValueObjects')
        );
    }

    _writingReactTemplate() {
        this.fs.copy(
            this.templatePath('frontend'),
            this.destinationPath('frontend')
        )
        this.fs.copyTpl(
            this.templatePath('frontend/public/index.html'),
            this.destinationPath('frontend/public/index.html'),

            { title: this.answers.name } // Embedded JavaScript templating.

        )
    }

    _writingApiTemplate() {
        this.fs.copy(
            this.templatePath('api'),
            this.destinationPath('api')
        )
    }

    _ignoreFilesExample(ignores) {
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Errors.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/Errors.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Infrastructure/Errors.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/AddProductToOrder/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/CancelOrder/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/CompleteOrder/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/CreateOrder/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/RemoveProduct/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/UpdateQuantityProduct/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Commands/AddProductToOrder/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Queries/FindOrderById/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/Queries/GetAllOrders/**');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/ClientDto.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/OrderDto.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Application/Order/DataTransferObjects/ProductDto.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/DataTransferObjects/*.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/DomainEvents/*.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/Entities/*.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/Enums/*.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/Repositories/*.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Domain/OrderAggregate.cs');
        ignores.push('src/domain/CodeDesignPlus.Net.Microservice.Infrastructure/Repositories/OrderRepository.cs');
        ignores.push('src/entrypoints/CodeDesignPlus.Net.Microservice.AsyncWorker/Consumers/**');
        ignores.push('src/entrypoints/CodeDesignPlus.Net.Microservice.gRpc/Protos/*.proto');
        ignores.push('src/entrypoints/CodeDesignPlus.Net.Microservice.gRpc/Services/*.cs');
        ignores.push('src/entrypoints/CodeDesignPlus.Net.Microservice.Rest/Controllers/**');
        ignores.push('tests/integration/CodeDesignPlus.Net.Microservice.AsyncWorker.Test/Consumers/**');
        ignores.push('tests/integration/CodeDesignPlus.Net.Microservice.gRpc.Test/Protos/**');
        ignores.push('tests/integration/CodeDesignPlus.Net.Microservice.gRpc.Test/Services/**');
        ignores.push('tests/integration/CodeDesignPlus.Net.Microservice.gRpc.Test/Protos/**');
        ignores.push('tests/integration/CodeDesignPlus.Net.Microservice.Rest.Test/Controllers/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/AddProductToOrder/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/CancelOrder/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/CompleteOrder/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/CreateOrder/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/RemoveProduct/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/UpdateQuantityProduct/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Commands/AddProductToOrder/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Queries/FindOrderById/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/Queries/GetAllOrders/**');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/DataTransferObjects/ClientDto.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/DataTransferObjects/OrderDto.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Application.Test/Order/DataTransferObjects/ProductDto.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Infrastructure.Test/Repositories/*.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Domain.Test/DomainEvents/*.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Domain.Test/OrderAggregateTest.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.AsyncWorker.Test/Consumers/*.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.gRpc.Test/Services/*.cs');
        ignores.push('tests/unit/CodeDesignPlus.Net.Microservice.Rest.Test/Controllers/*.cs');

    }

    async _createEmptyFolders() {

        await Promise.all([
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Application`, this.answers.name, 'Commands')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Application`, this.answers.name, 'Queries')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Application`, this.answers.name, 'DataTransferObjects')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain`, 'DataTransferObjects')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain`, 'Enums')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain`, 'Repositories')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain`, 'Entities')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain`, 'DomainEvents')),
            makeDirectory(path.join(destination, 'src', 'domain', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Infrastructure`, 'Repositories')),
            makeDirectory(path.join(destination, 'src', 'entrypoints', `CodeDesignPlus.Net.Microservice.${this.answers.name}.AsyncWorker`, 'Consumers')),
            makeDirectory(path.join(destination, 'src', 'entrypoints', `CodeDesignPlus.Net.Microservice.${this.answers.name}.gRpc`, 'Protos')),
            makeDirectory(path.join(destination, 'src', 'entrypoints', `CodeDesignPlus.Net.Microservice.${this.answers.name}.gRpc`, 'Services')),
            makeDirectory(path.join(destination, 'src', 'entrypoints', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Rest`, 'Controllers')),
            makeDirectory(path.join(destination, 'tests', 'integration', `CodeDesignPlus.Net.Microservice.${this.answers.name}.AsyncWorker.Test`, 'Consumers')),
            makeDirectory(path.join(destination, 'tests', 'integration', `CodeDesignPlus.Net.Microservice.${this.answers.name}.gRpc.Test`, 'Protos')),
            makeDirectory(path.join(destination, 'tests', 'integration', `CodeDesignPlus.Net.Microservice.${this.answers.name}.gRpc.Test`, 'Services')),
            makeDirectory(path.join(destination, 'tests', 'integration', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Rest.Test`, 'Controllers')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Application.Test`, this.answers.name, 'Commands')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Application.Test`, this.answers.name, 'Queries')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Application.Test`, this.answers.name, 'DataTransferObjects')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Infrastructure.Test`, 'Repositories')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain.Test`, 'DataTransferObjects')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain.Test`, 'Enums')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain.Test`, 'Repositories')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain.Test`, 'Entities')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Domain.Test`, 'DomainEvents')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.AsyncWorker.Test`, 'Consumers')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.gRpc.Test`, 'Services')),
            makeDirectory(path.join(destination, 'tests', 'unit', `CodeDesignPlus.Net.Microservice.${this.answers.name}.Rest.Test`, 'Controllers'))
        ]);
    }

};
