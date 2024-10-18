import path from 'path';
import Xml from './xml.mjs';

export default class ProtoGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'proto';
    }

    async prompt(defaultValues) {
        const answers = await this._generator.prompt([
            {
                type: 'input',
                name: 'proto',
                message: 'What is the name of the protobuf file you want to create?'
            }
        ]);

        return {
            proto: answers.proto,
            createProto: true
        }
    }

    async generate(options) {
        if (options.createProto) {
            const solution = `${options.solution}.gRpc`;

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

    getArguments() {
        this._generator.argument('proto', { type: String, alias: 'p', required: true, description: 'The name of the protobuf file to create.' });
    }
}
