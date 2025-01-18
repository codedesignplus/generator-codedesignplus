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
import AsyncWorkerGenerator from './asyncWorker.mjs';
import GrpcGenerator from './grpc.mjs';
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
                'Available Commands:\n\n' +
                ' - yo codedesignplus:microservice microservice  | Creates the base structure for a new microservice, choosing between CRUD or custom patterns.\n' +
                ' - yo codedesignplus:microservice aggregate     | Creates a new aggregate within an existing microservice.\n' +
                ' - yo codedesignplus:microservice entity        | Creates one or more entities.\n' +
                ' - yo codedesignplus:microservice valueObject   | Creates one or more value objects.\n' +
                ' - yo codedesignplus:microservice domainEvent   | Creates one or more domain events associated with an aggregate.\n' +
                ' - yo codedesignplus:microservice repository    | Creates a repository for a specific aggregate.\n' +
                ' - yo codedesignplus:microservice controller    | Creates a controller to handle incoming requests.\n' +
                ' - yo codedesignplus:microservice proto         | Creates a .proto file for a gRPC service.\n' +
                ' - yo codedesignplus:microservice consumer      | Creates a consumer that reacts to domain events.\n' +
                ' - yo codedesignplus:microservice query         | Creates one or more queries to retrieve data.\n' +
                ' - yo codedesignplus:microservice command       | Creates one or more commands to perform actions that change the system state.\n' +
                ' - yo codedesignplus:microservice dto           | Creates one or more Data Transfer Objects (DTOs) to transfer data.\n\n' +
                ' - yo codedesignplus:microservice grpc          | Creates a gRPC project.\n' +
                ' - yo codedesignplus:microservice asyncWorker   | Creates an async worker project.\n\n' +
                'Usage:\n\n' +
                'To use a command, run `yo codedesignplus:microservice <command> --option1 <value> --option2 <value>`.\n\n' +
                'For more details on each command and its options, use the `--help` flag after the specific command (e.g., `yo codedesignplus:microservice microservice --help`).\n\n',

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
                'valueObject': ValueObjectGenerator,
                'grpc': GrpcGenerator,
                'asyncWorker': AsyncWorkerGenerator
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