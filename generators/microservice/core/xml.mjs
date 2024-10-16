import { readFileSync, writeFileSync } from 'fs';
import { Parser, Builder } from 'xml2js';

export default class Xml {
    constructor(filePath) {
        this.filePath = filePath;
        this.parser = new Parser();
        this.builder = new Builder();
    }

    async _parseFile() {
        const content = readFileSync(this.filePath, 'utf8');
        this.ast = await this.parser.parseStringPromise(content);
    }

    _writeFile() {
        const xml = this.builder.buildObject(this.ast);
        writeFileSync(this.filePath, xml, 'utf8');
    }

    async addProtobuf(protoPath, grpcServices = "Server") {
        await this._parseFile();

        const protoEntry = {
            Protobuf: {
                $: {
                    Include: protoPath,
                    GrpcServices: grpcServices
                }
            }
        };

        let itemGroup = this.ast.Project.ItemGroup.find(group => group.$ && group.$.Label === "Protos");

        if (itemGroup) {
            itemGroup.Protobuf = itemGroup.Protobuf || [];
            itemGroup.Protobuf.push(protoEntry.Protobuf);
        } else {
            itemGroup = {
                $: { Label: "Protos" },
                Protobuf: [protoEntry.Protobuf]
            };
            this.ast.Project.ItemGroup.push(itemGroup);
        }

        this._writeFile();
    }
}