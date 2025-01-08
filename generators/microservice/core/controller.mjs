import path from 'path';
export default class ControllerGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'controller';
    }

    getArguments() {
        this._generator.option('controller', { type: String, alias: 'cr', required: true, description: 'The name of the controller to create.' });
    }
}
