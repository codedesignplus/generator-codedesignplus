import Generator from 'yeoman-generator';
import { glob } from 'glob';
import path from 'path';
import replace from 'gulp-replace';
import { makeDirectory } from 'make-dir';
import { findUp } from 'find-up';

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
                    type: 'input',
                    name: 'name',
                    message: 'Your microservice name',
                    default: this.name,
                    store: true,
                },
                {
                    type: 'confirm',
                    name: 'enableExample',
                    message: 'Would you like to include an example?',
                    default: '',
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Domain Event') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your domain event name',
                    default: this.name,
                    store: true,
                },
                {
                    type: 'input',
                    name: 'entity',
                    message: 'Your aggregate or entity name',
                    default: this.name,
                    store: true,
                },
                {
                    type: 'input',
                    name: 'verb',
                    message: 'Your verb domain event name',
                    default: this.name,
                    store: true,
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Entity') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your entity name',
                    default: this.name,
                    store: true
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Data Transfer Object') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your data transfer object name',
                    default: this.name,
                    store: true
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Repository') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your repository name',
                    default: this.name,
                    store: true
                },
                {
                    type: 'confirm',
                    name: 'isInterface',
                    message: 'Is a interface repository?',
                    default: '',
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Aggregate') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your aggregate name',
                    default: this.name,
                    store: true,
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Command' || this.answers.resource === 'Query') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: `Your ${this.answers.resource} name`,
                    default: this.name,
                    store: true,
                },
                {
                    type: 'input',
                    name: 'useCase',
                    message: 'Your use case name',
                    store: true
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Consumer') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your consumer name',
                    default: this.name,
                    store: true,
                },
                {
                    type: 'input',
                    name: 'action',
                    message: 'Your action name',
                    store: true,
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

        if (this.answers.resource === 'Controller') {
            const additionalAnswers = await this.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your controller name',
                    default: this.name,
                    store: true,
                }
            ]);

            this.answers = { ...this.answers, ...additionalAnswers };
        }

    }

    async writing() {

        switch (this.answers.resource) {
            case 'Aggregate':
                await this._writingAggregate()
                break;
            // case 'Async Worker':
            //     this._writingAsyncWorker()
            //     break;
            case 'Microservice':
                await this._writingMicroservice()
                break;
            case 'Command':
                await this._writingCommand()
                break;
            case 'Consumer':
                await this._writingConsumer()
                break;
            case 'Controller':
                await this._writingController()
                break;
            case 'Data Transfer Object':
                await this._writingDataTransferObject()
                break;
            case 'Domain Event':
                await this._writingDomainEvent()
                break;
            case 'Entity':
                await this._writingEntity()
                break;
            // case 'gRpc':
            //     this._writinggRpc()
            //     break;
            case 'Query':
                await this._writingQuery()
                break;
            case 'Repository':
                await this._writingRepository()
                break;
            // case 'Rest':
            //     this._writingRest()
            //     break;
            case 'Value Object':
                this._writingValueObject()
                break;
        }
    }

    async _writingAggregate() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath('aggregate/ItemAggregate.cs'),
            this.destinationPath(`${content.name}Aggregate.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain`,
                name: content.name,
            }
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

            await this.fs.copyAsync(src, dest, { overwrite: false, errorOnExist: false });
        }

        if (!this.answers.enableExample) {
            await this._createEmptyFolders(destination);
        }

        this.fs.writeJSON(`${destination}/archetype.json`, {
            "name": this.answers.name,
            "description": "Custom Microservice",
            "version": "1.0.0",
            "organization": this.answers.organization
        }, { spaces: 2 });
    }

    async _writingCommand() {
        const content = await this._readArchetypeMetadata();

        const namespace = `${content.organization}.Net.Microservice.${content.name}.Application.${content.name}.Commands.${this.answers.useCase}`;

        await this.fs.copyTplAsync(
            this.templatePath('command/ItemCommand.cs'),            
            this.destinationPath(path.join(this.answers.useCase, `${content.name}Command.cs`)),
            {
                ns: namespace,
                name: this.answers.name,
            }
        );

        await this.fs.copyTplAsync(
            this.templatePath('command/ItemCommandHandler.cs'),
            this.destinationPath(path.join(this.answers.useCase, `${this.answers.name}CommandHandler.cs`)),
            {
                ns: namespace,
                name: this.answers.name,
            }
        );
    }

    async _writingConsumer() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath('consumer/ItemHandler.cs'),
            this.destinationPath(`${content.name}Handler.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.AsyncWorker.Consumers`,
                name: this.answers.name,
                action: this.answers.action,
                entity: this.answers.name.toLowerCase()
            }
        );
    }

    async _writingController() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath('controller/ItemController.cs'),
            this.destinationPath(`${content.name}Controller.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Rest.Controllers`,
                name: this.answers.name
            }
        );
    }

    async _writingDataTransferObject() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath('data-transfer-object/ItemDto.cs'),
            this.destinationPath(`${content.name}Dto.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.DataTransferObjects`,
                name: this.answers.name,
            }
        );
    }

    async _writingDomainEvent() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath('domain-event/ItemDomainEvent.cs'),
            this.destinationPath(`${content.name}DomainEvent.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.DomainEvents`,
                name: this.answers.name,
                entity: this.answers.entity,
                verb: this.answers.verb
            }
        );
    }

    async _writingEntity() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath('entity/ItemEntity.cs'),
            this.destinationPath(`${content.name}Entity.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.Domain.Entities`,
                name: content.name,
            }
        );
    }

    _writinggRpc() {
        this.fs.copyTpl(
            this.templatePath('grpc'),
            this.destinationPath('src/entrypoints/gRpc')
        );
    }

    async _writingQuery() {
        const content = await this._readArchetypeMetadata();

        const namespace = `${content.organization}.Net.Microservice.${content.name}.Application.${content.name}.Queries.${this.answers.useCase}`;

        await this.fs.copyTplAsync(
            this.templatePath('query/ItemQuery.cs'),            
            this.destinationPath(path.join(this.answers.useCase, `${content.name}Query.cs`)),
            {
                ns: namespace,
                name: this.answers.name,
            }
        );

        await this.fs.copyTplAsync(
            this.templatePath('query/ItemQueryHandler.cs'),
            this.destinationPath(path.join(this.answers.useCase, `${this.answers.name}QueryHandler.cs`)),
            {
                ns: namespace,
                name: this.answers.name,
            }
        );
    }

    async _writingRepository() {
        const content = await this._readArchetypeMetadata();

        await this.fs.copyTplAsync(
            this.templatePath(`repository/${this.answers.isInterface ? 'I' : ''}ItemRepository.cs`),
            this.destinationPath(`${this.answers.isInterface ? 'I' : ''}${content.name}Repository.cs`),
            {
                ns: `${content.organization}.Net.Microservice.${content.name}.${this.answers.isInterface ? 'Domain' : 'Infrastructure'}.Repositories`,
                name: content.name,
            }
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

    _createEmptyFolders(destination) {

        return Promise.all([
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


    async _readArchetypeMetadata() {
        const archetypeMetadata = await findUp('archetype.json');

        if (!archetypeMetadata) {
            throw new Error('No se encontró el archivo archetype.json');
        }

        const content = await this.fs.readJSON(archetypeMetadata);
        return content;
    }

};

