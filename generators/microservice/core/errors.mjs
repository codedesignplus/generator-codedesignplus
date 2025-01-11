export default class ErrorsGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
    }

    async generate(options) {
        const layers = {
            'Domain': {
                "code": '100',
                "destination": options.paths.src.domain
            },
            'Application': {
                "code": '200',
                "destination": options.paths.src.application
            },
            'Infrastructure': {
                "code": '300',
                "destination": options.paths.src.infrastructure
            }
        };

        for (const layer in layers) {
            const { code, destination } = layers[layer];

            this._generator.fs.copyTplAsync(
                this._generator.templatePath('errors/Error.cs'),
                this._generator.destinationPath(`${destination}/Errors.cs`),
                {
                    ns: `${options.solution}.${layer}`,
                    code: `${code} : UnknownError`,
                }
            );
        }
    }
}
