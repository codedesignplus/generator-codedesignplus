import Generator from 'yeoman-generator';

export default class extends Generator {
    
  async prompting() {
    const answers = await this.prompt([{
          type: 'input',
          name: 'name',
          message: 'Your project name',
          default: this.appname // Default to current folder name
      }]);
      this.log('app name', answers.name);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      { title: 'Templating with Yeoman' }
    );
  }
};