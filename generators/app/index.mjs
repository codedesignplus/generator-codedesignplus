var Generator = require('yeoman-generator');

export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    async prompting() {
        this.log('Generator for app');
        // Add prompting logic here
    }

    writing() {
        // Add writing logic here
    }

    // initializing() {
    //     this.composeWith(require.resolve('../netcore/library'));
    //     this.composeWith(require.resolve('../netcore/microservice'));
    // }
}
