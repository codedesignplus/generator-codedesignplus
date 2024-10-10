import Generator from 'yeoman-generator';
import Core from './core/core.mjs';
import Utils from './core/utils.mjs';
export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);

        this._utils = new Utils(this);

        this._core = new Core(this._utils, this);
    }

    async prompting() {
        await this._core.prompt();
    }

    async writing() {
        await this._utils.setPathBase();

        this.log('Path base: ', this.destinationRoot());

         await this._core.generator.generate();
    }
};

