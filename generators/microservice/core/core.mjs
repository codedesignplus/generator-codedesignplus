import AggregateGenerator from './aggregate.mjs';
import CommandGenerator from './command.mjs';
import QueryGenerator from './query.mjs';
import ConsumerGenerator from './consumer.mjs';
import ControllerGenerator from './controller.mjs';
import DtoGenerator from './dataTransferObject.mjs';
import DomainEventGenerator from './domainEvent.mjs';
import EntityGenerator from './entity.mjs';
import RepositoryGenerator from './repository.mjs';
import MicroserviceGenerator from './microservice.mjs';
import WizardGenerator from './wizard.mjs';
import ValueObjectGenerator from './valueObject.mjs';
import ProtoGenerator from './proto.mjs';
import figlet from 'figlet';
import boxen from 'boxen';

export default class Core {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    arguments() {
        // Mostrar el banner con Figlet
        console.log(figlet.textSync('CodeDesignPlus'));

        // Descripción del generador usando Boxen
        console.log(boxen(
            'This generator is designed for the CodeDesignPlus microservice archetype, version 1.0. ' +
            'It streamlines the development process by enabling developers to easily create internal resources ' +
            'within a microservice. Adhering to best practices, standards, and guidelines established in the archetype, ' +
            'this tool promotes consistency and efficiency in your projects.\n\n' +
            'Available templates (each with its own arguments):\n' +
            '- aggregate: Create a DDD aggregate.\n' +
            '- command: Generate a CQRS command.\n' +
            '- consumer: Define a message consumer.\n' +
            '- controller: Scaffold a controller following RESTful principles.\n' +
            '- dto: Create a Data Transfer Object (DTO).\n' +
            '- domainEvent: Define a domain event for use in event sourcing.\n' +
            '- entity: Generate a domain entity.\n' +
            '- microservice: Set up a basic microservice structure.\n' +
            '- proto: Create a Protobuf definition for gRPC services.\n' +
            '- query: Generate a CQRS query.\n' +
            '- repository: Scaffold a repository for data persistence.\n' +
            '- valueObject: Define a DDD value object.\n' +
            '- wizard: Interactive wizard to guide through multiple templates.',
            { padding: 1, margin: 1, borderStyle: 'round' }
        ));

        this._generator.argument('template', {
            type: String,
            alias: 't',
            description: 'The type of component to generate.',
            required: false
        });

        if (this._generator.options.template) {
            const generatorsMap = {
                'aggregate': AggregateGenerator,
                'command': CommandGenerator,
                'consumer': ConsumerGenerator,
                'controller': ControllerGenerator,
                'dto': DtoGenerator,
                'domainEvent': DomainEventGenerator,
                'entity': EntityGenerator,
                'microservice': MicroserviceGenerator,
                'proto': ProtoGenerator,
                'query': QueryGenerator,
                'repository': RepositoryGenerator,
                'valueObject': ValueObjectGenerator,
                'wizard': WizardGenerator
            };

            this._generator.argument('organization', { type: String, alias: 'o', required: true, description: 'The organization or company name used in the microservice\'s namespace' });
            this._generator.argument('microservice', { type: String, alias: 'm', required: true, description: 'The name of the microservice, used in the namespace' });

            const generatorClass = generatorsMap[this._generator.options.template];

            if (!generatorClass)
                throw new Error(`The resource ${this._generator.options.template} is not supported`);

            const generatorInstance = new generatorClass(this._utils, this._generator);

            generatorInstance.getArguments();

            return [generatorInstance, {
                ...this._generator.options,
            }];
        }

        return [null, null];
    }

    async prompt() {
        let defaultValues = {};

        try {
            defaultValues = await this._utils.readArchetypeMetadata();
        }
        catch (error) { }

        this._generator.answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'organization',
                message: 'What is your organization\'s name?',
                default: defaultValues.organization,
            },
            {
                type: 'input',
                name: 'microservice',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'list',
                name: 'resource',
                message: 'Select the resource create:',
                choices: [
                    'Wizard',
                    'Aggregate',
                    'Async Worker',
                    'Microservice',
                    'Command',
                    'Consumer',
                    'Controller',
                    'Data Transfer Object',
                    'Domain Event',
                    'Entity',
                    'Proto',
                    'Query',
                    'Repository',
                    'Rest',
                    'Value Object'
                ],
            }
        ]);

        const generatorsMap = {
            'Wizard': WizardGenerator,
            'Microservice': MicroserviceGenerator,
            'Domain Event': DomainEventGenerator,
            'Entity': EntityGenerator,
            'Data Transfer Object': DtoGenerator,
            'Repository': RepositoryGenerator,
            'Aggregate': AggregateGenerator,
            'Command': CommandGenerator,
            'Query': QueryGenerator,
            'Consumer': ConsumerGenerator,
            'Controller': ControllerGenerator,
            'Value Object': ValueObjectGenerator,
            'Proto': ProtoGenerator
        };

        const selectedResource = this._generator.answers.resource;
        const generatorClass = generatorsMap[selectedResource];

        if (!generatorClass)
            throw new Error(`The resource ${selectedResource} is not supported`);

        const generatorInstance = new generatorClass(this._utils, this._generator);
        const answers = await generatorInstance.prompt(defaultValues);

        return [generatorInstance, answers];
    }
}