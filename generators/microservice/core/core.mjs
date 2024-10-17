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

export default class Core {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }


    async prompt() {
        let defaultValues = {};

        try {
            defaultValues = await this._utils.readArchetypeMetadata();
        }
        catch (error) {
            defaultValues = {
                organization: 'CodeDesignPlus',
                microservice: 'Stage'
            };
        }

        this._generator.answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'organization',
                message: 'What is your organization\'s name?',
                default: defaultValues.organization,
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