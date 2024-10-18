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
        console.log(figlet.textSync('CodeDesignPlus'));

        if (this._generator.options.help)
            console.log(boxen(
                'Welcome to the CodeDesignPlus Microservice Archetype Generator (v1.0)\n\n' +
                'This generator helps developers quickly create resources for microservices following best practices in the CodeDesignPlus architecture.\n\n' +

                '--------------------------------------------------------------------------------\n' +
                'Available Commands:\n' +
                '--------------------------------------------------------------------------------\n' +
                'Domain Commands:\n' +
                '- aggregate:    yo codedesignplus:microservice aggregate <organization> <microservice> <aggregateName>\n' +
                '- entity:       yo codedesignplus:microservice entity <organization> <microservice> <entityName>\n' +
                '- valueObject:  yo codedesignplus:microservice valueObject <organization> <microservice> <valueObjectName>\n' +
                '- domainEvent:  yo codedesignplus:microservice domainEvent <organization> <microservice> <entityName> <domainEvent>\n' +

                '\nInfrastructure Commands:\n' +
                '- repository:   yo codedesignplus:microservice repository <organization> <microservice> <repositoryName>\n' +
                '- controller:   yo codedesignplus:microservice controller <organization> <microservice> <controllerName>\n' +
                '- proto:        yo codedesignplus:microservice proto <organization> <microservice> <protoName> --createProto\n' +

                '\nConsumer Commands:\n' +
                '- consumer:     yo codedesignplus:microservice consumer <organization> <microservice> <aggregateName> <consumerName> <action> <domainEvent> --createConsumer\n' +

                '\nCqrs Commands:\n' +
                '- command:      yo codedesignplus:microservice command <organization> <microservice> <aggregateName> <repositoryName> <commandName>\n' +
                '- query:        yo codedesignplus:microservice query <organization> <microservice> <aggregateName> <repositoryName> <queryName>\n' +

                '\nWizard (Multiple Resources at Once):\n' +
                '- yo codedesignplus:microservice wizard <organization> <microservice> <aggregate> [--domainEvents | --entities | --commands | --queries | --createController | --createProto --createConsumer]\n' +
                '- yo codedesignplus:microservice wizard <organization> <microservice> <aggregate> --isCrud [--createController | --createController | --createProto]\n' +

                '\nMicroservices:\n' +
                '- yo codedesignplus:microservice microservice <organization> <microservice> --isExample\n' +
                '- yo codedesignplus:microservice microservice <organization> <microservice> <aggregate> [--domainEvents | --entities | --commands | --queries | --createController | --createProto | --createConsumer]\n' +
                '- yo codedesignplus:microservice microservice <organization> <microservice> <aggregate> --isCrud [--createController | --createProto | --createConsumer]\n' +

                '\nOther Commands:\n' +
                '-- help:        yo codedesignplus:microservice --help\n' +
                '-- version:     yo codedesignplus:microservice --version\n' +

                '\n--------------------------------------------------------------------------------\n' +
                'Argument and Option Values:\n' +
                '--------------------------------------------------------------------------------\n' +
                '<organization>   : CodeDesignPlus\n' +
                '<microservice>   : Organization | Tower | Stage\n' +
                '<aggregateName>  : Organization | Tower | Stage\n' +
                '<entityName>     : User | Client | Products\n' +
                '<valueObjectName>: Address | ContactInfo\n' +
                '<domainEvent>    : OrganizationCreated | TowerCreated | StageCreated\n' +
                '<repositoryName> : Organization | Tower | Stage\n' +
                '<controllerName> : Organization | Tower | Stage\n' +
                '<protoName>      : Organization | Tower | Stage\n' +
                '<consumerName>   : Organization | Tower | Stage\n' +
                '<action>         : create_organization | update_organization | delete_tower\n' +
                '<queryName>      : GetOrganizationById | GetTowerById | GetStageById\n' +

                '\n--------------------------------------------------------------------------------\n' +
                'Option Descriptions:\n' +
                '--------------------------------------------------------------------------------\n' +
                '--createProto: Generates a Protocol Buffer definition for the specified aggregate, facilitating communication between services.\n' +
                '--createConsumer: Generates a consumer for the specified aggregate, allowing it to handle domain events and perform actions related to that aggregate. When this flag is activated, the following arguments are mandatory:' +
                '    <consumer.isEntityOrAggregate> <consumer.consumer> <consumer.action> <consumer.domainEvent>\n' +
                '--domainEvents: Specify the domain events associated with the aggregate, enabling event-driven architecture within the microservice.\n' +
                '--commands: Specify the commands associated with the aggregate, defining operations that can modify its state.\n' +
                '--queries: Specify the queries associated with the aggregate, defining operations that can retrieve its state.\n' +
                '--isCrud: Indicate that the commands for the aggregate follow CRUD (Create, Read, Update, Delete) operations.\n' +

                '\n',

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