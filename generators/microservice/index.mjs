import Generator from 'yeoman-generator';
import Core from './core/core.mjs';
import Utils from './core/utils.mjs';
export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        const utils = new Utils(this);

        this._core = new Core(utils, this);
    }

    async prompting() {
        await this._core.prompt();
    }

    async writing() {
        await this._core.generator.generate();
    }
};

