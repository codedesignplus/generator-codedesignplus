import Generator from 'yeoman-generator';
import Core from './core/core.mjs';
import Utils from './core/utils.mjs';
import DotNet from './core/dotnet.mjs';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this._utils = new Utils(this);
        this._core = new Core(this._utils, this);
        this._dotnet = new DotNet(this);

        const [generator, answers] = this._core.arguments();

        this._answers = answers;
        this._generator = generator;
    }

    async prompting() {
        if (this._answers && this._generator)
            return;

        const [generator, answers] = await this._core.prompt();

        this._answers = answers;
        this._generator = generator;
    }

    async writing() {
        await this._utils.setPathBase();

        const options = await this._utils.getOptions(this._answers);

        await this._generator.generate(options);

        if (this._generator.name === 'microservice'){
            this._dotnet.removeProjects(options);
        }
    }
};

