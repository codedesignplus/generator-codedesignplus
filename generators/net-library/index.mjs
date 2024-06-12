import Generator from 'yeoman-generator';
import { glob } from 'glob';
import path from 'path';
import replace from 'gulp-replace';

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("organization-name", { type: String, required: false });
    this.argument("project-name", { type: String, required: false });
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "organization",
        message: "Your Organization Name:",
        default: this.options.organizationName
      },
      {
        type: "input",
        name: "name",
        message: "Your project name:",
        default: this.options.projectName
      }
    ]);
  }

  async initializing() {
    this.log("Copy templates...");

    const template = this.templatePath();
    const subModule = path.join(this.destinationRoot(), 'submodules', 'CodeDesignPlus.Net.Library');

    const files = glob.sync('**', { dot: true, nodir: true, cwd: subModule })

    for (let i in files) {
      const src = path.resolve(subModule, files[i]);
      const dest = path.resolve(template, files[i]);

      await this.fs.copyAsync(src, dest, { overwrite: true, errorOnExist: false })
    }
  }

  async writing() {
    const library = `${this.answers.organization}.Net.${this.answers.name}`;
    const template = this.templatePath();
    const destination = path.join(this.destinationRoot(), library);

    const replaceStream = replace(/CodeDesignPlus\.Net\.Library/g, library);

    this.queueTransformStream(replaceStream);

    const files = glob.sync('**', { dot: true, nodir: true, cwd: template })

    for (const i in files) {

      const src = path.resolve(template, files[i]);
      const dest = path.resolve(destination, files[i].replace(/CodeDesignPlus.Net.Library/g, library));

      await this.fs.copyAsync(src, dest, { overwrite: true, errorOnExist: false })
    }
  }
}