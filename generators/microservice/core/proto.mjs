import path from 'path';

export default class ProtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'microserviceName',
                message: 'What is the name of your microservice?',
                default: defaultValues.microservice
            },
            {
                type: 'input',
                name: 'proto',
                message: 'What is the name of the protobuf file you want to create?'
            }
        ]);

        return {
            microserviceName: answers.microserviceName,
            proto: answers.proto,
            createProtoForAggregate: true
        }
    }

    async generate(options) {
        if (options.createProtoForAggregate) {
            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('grpc/grpc.proto'),
                this._generator.destinationPath(path.join(options.paths.src.grpc, 'Protos', options.proto.file)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.gRpc`,
                    name: options.proto.fullname
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('grpc/grpc.proto'),
                this._generator.destinationPath(path.join(options.paths.integrationTests.grpc, 'Protos', options.proto.file)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.gRpc.Test`,
                    name: options.proto.fullname
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('grpc/ItemService.cs'),
                this._generator.destinationPath(path.join(options.paths.src.grpc, 'Services', `${options.proto.name}Service.cs`)),
                {
                    ns: `${options.organization}.Net.Microservice.${options.microserviceName}.gRpc.Services`,
                    name: options.proto.name
                }
            );
        }
    }
}
