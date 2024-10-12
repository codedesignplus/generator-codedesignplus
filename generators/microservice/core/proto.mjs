import path from 'path';

export default class ProtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt() {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?'
            },            
            {
                type: 'input',
                name: 'proto',
                message: 'What is the name of the protobuf file you want to create?'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            proto: answers.proto
        }
    }

    async generate(options) {
        await this._generator.fs.copyTplAsync(
            this._generator.templatePath('grpc/grpc.proto'),
            this._generator.destinationPath(path.join(options.paths.src.grpc, 'Protos', `${options.proto.toLowerCase() }.proto`)),
            {
                ns: `${options.organization}.Net.Microservice.${options.microserviceName}.gRpc`,
                name: options.proto
            }
        );
    }
}
