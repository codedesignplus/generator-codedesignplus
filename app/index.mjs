import Generator from 'yeoman-generator';
import chalk from 'chalk';

export default class extends Generator {

    constructor(args, opts) {
      super(args, opts);
      this.argument('appname', { type: String, required: false });
    }

    // Async Await
    async prompting() {
        this.answers = await this.prompt([{
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname, // appname return the default folder name to project
                store: true,
            }, {
                type: 'list',
                name: 'templateType',
                message: 'Select the template wanted:',
                choices: ['library', 'microservice']
            }
        ]);
    }

    install() {
        this.npmInstall();
    }

    writing() {
        if (this.answers.templateType === 'library') {
            console.log("frontend");
        } else if (this.answers.templateType === 'microservice') {
            console.log("microservice");
        }
        else {
            console.log("not support");
        }
    }
  };