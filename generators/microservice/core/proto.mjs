import path from 'path';
import Xml from './xml.mjs';

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
            const solution = `${options.organization}.Net.Microservice.${options.microserviceName}.gRpc`;

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('grpc/grpc.proto'),
                this._generator.destinationPath(path.join(options.paths.src.grpc, 'Protos', options.proto.file)),
                {
                    ns: solution,
                    name: options.proto.fullname
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('grpc/grpc.proto'),
                this._generator.destinationPath(path.join(options.paths.integrationTests.grpc, 'Protos', options.proto.file)),
                {
                    ns: `${solution}.Test`,
                    name: options.proto.fullname
                }
            );

            await this._generator.fs.copyTplAsync(
                this._generator.templatePath('grpc/ItemService.cs'),
                this._generator.destinationPath(path.join(options.paths.src.grpc, 'Services', `${options.proto.name}Service.cs`)),
                {
                    ns: `${solution}.Services`,
                    name: options.proto.name
                }
            );

            const grpcProject = new Xml(`${this._generator.destinationPath()}/${options.paths.src.grpc}/${solution}.csproj`);

            await grpcProject.addProtobuf(`Protos\\${options.proto.file}`);
            
            const grpcTestProject = new Xml(`${this._generator.destinationPath()}/${options.paths.integrationTests.grpc}/${solution}.Test.csproj`);
            
            await grpcTestProject.addProtobuf(`Protos\\${options.proto.file}`);
        }
    }
}
