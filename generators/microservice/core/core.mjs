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
                '- controller:   yo codedesignplus:microservice controller <organization> <microservice> <controllerName> --enableRest\n' +
                '- proto:        yo codedesignplus:microservice proto <organization> <microservice> <protoName> --enableGrpc\n' +
                '- consumer:     yo codedesignplus:microservice consumer <organization> <microservice> <consumer.consumer> <consumer.aggregate> <consumer.action> <consumer.domainEvent> --enableAsyncWorker\n' +

                '\nCQRS Commands:\n' +
                '- command:      yo codedesignplus:microservice command <organization> <microservice> <aggregate> <repository> <commands>\n' +
                '- query:        yo codedesignplus:microservice query <organization> <microservice> <aggregateName> <repositoryName> <queryName>\n' +

                '\nMicroservices:\n' +
                '- yo codedesignplus:microservice microservice <organization> <microservice> <description> <contactName> <contactEmail> <vault> <aggregate> [--domainEvents | --entities | --commands | --queries | --enableRest | --enableGrpc | --enableAsyncWorker]\n' +
                '- 1. yo codedesignplus:microservice microservice <organization> <microservice> <description> <contactName> <contactEmail> <vault> <aggregate> --isCrud [--enableRest | --enableGrpc | --enableAsyncWorker]\n' +

                '\nOther Commands:\n' +
                '-- help:        yo codedesignplus:microservice --help\n' +
                '-- version:     yo codedesignplus:microservice --version\n' +
                '\n',

                { padding: 1, margin: 1, borderStyle: 'round' }
            ));

        this._generator.argument('template', {
            type: String,
            alias: 't',
            description: 'The type of component to generate.',
            required: true
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
                'valueObject': ValueObjectGenerator
            };

            this._generator.option('organization', { type: String, alias: 'o', required: true, description: 'The organization or company name used in the microservice\'s namespace' });
            this._generator.option('microservice', { type: String, alias: 'm', required: true, description: 'The name of the microservice, used in the namespace' });
            
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
}