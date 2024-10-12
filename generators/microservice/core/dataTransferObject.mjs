import path from 'path';
import { glob } from 'glob';

export default class DtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        const aggregates = glob.sync('**/*Aggregate.cs').map(x => path.basename(x, '.cs'));
        
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?'
            },
            {
                type: 'list',
                name: 'entity',
                message: 'Select the aggregate you want to associate with the data transfer object:',
                choices: aggregates,
            },
            {
                type: 'input',
                name: 'dataTransferObject',
                message: 'What is the name of the data transfer object you want to create?'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            aggregateName: answers.entity,
            dataTransferObject: answers.dataTransferObject
        }
    }

    async generate(options) {
        const aggregate = glob.sync(`**/${options.aggregateName}Aggregate.cs`)[0];

        const nameClass = (await this._utils.getClassName(aggregate)).replace(/(Aggregate|Entity)/g, '');

        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('data-transfer-object/ItemDto.cs'),
            this._generator.destinationPath(path.join(options.paths.src.application, `${nameClass}`, `DataTransferObjects`, `${options.dataTransferObject}Dto.cs`)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${nameClass}.DataTransferObjects`,
                name: options.dataTransferObject
            }
        );

        await this._utils.addUsing(options.paths.src.application, `${options.organization}.Net.Microservice.${options.microserviceName}.Application.${nameClass}.DataTransferObjects`);
    }
}