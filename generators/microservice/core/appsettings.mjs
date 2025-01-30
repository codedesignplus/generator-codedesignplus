import path from 'path';

export default class AppSettingsGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'appsettings';
    }

    async generate(options, sources = []) {

        if(sources.length === 0) {
            sources = [
                options.paths.src.rest,
                options.paths.src.grpc,
                options.paths.src.asyncWorker
            ];
        }

        const destination = this._generator.destinationPath();

        sources.forEach(source => {

            const appSettingsFile = path.join(destination, source, 'appsettings.json');

            const json = this._generator.fs.readJSON(appSettingsFile, {});

            json.Core.AppName = options.appSettings.appName;
            json.Core.Description = options.appSettings.description;
            json.Core.Business = options.appSettings.business;
            json.Core.Contact.Name = options.appSettings.contact.name;
            json.Core.Contact.Email = options.appSettings.contact.email;
            json.Vault.Solution = options.appSettings.vault;
            json.Vault.AppName = options.appSettings.appName;
            json.Mongo.Database = options.appSettings.database;

            this._generator.fs.writeJSON(appSettingsFile, json);
        });

        try {
            this._updateConfigVault(path.join('tools', 'vault','config-vault.ps1'), options);
            this._updateConfigVault(path.join('tools', 'vault','config-vault.sh'), options);
            this._updateReadme(options);
        } catch (error) {
            console.log('The vault configuration could not be updated.');
            console.log(error);
        }    
    }

    _updateConfigVault(file, options) {
        const configFile = this._generator.destinationPath(file);

        let config = this._generator.fs.read(configFile);

        const vault = options.appSettings.vault.toLowerCase();

        config = config.replace(/\bvault-keyvalue\b/g, `${vault}-keyvalue`);
        config = config.replace(/\bvault-database\b/g, `${vault}-database`);
        config = config.replace(/\bvault-rabbitmq\b/g, `${vault}-rabbitmq`);
        config = config.replace(/\bvault-transit\b/g, `${vault}-transit`);
        config = config.replace(/\bvault-approle\b/g, `${vault}-approle`);
        config = config.replace(/ms-archetype/g, options.appSettings.appName);

        this._generator.fs.write(configFile, config);
    }

    _updateReadme(options) {
        const readmeFile = this._generator.destinationPath('README.md');

        let readme = this._generator.fs.read(readmeFile);

        readme = readme.replace(/\bms-archetype\b/g, options.appSettings.appName);

        this._generator.fs.write(readmeFile, readme);
    }

    getArguments() {
        this._generator.option('description', { type: String, alias: 'd', required: true, description: 'A detailed description of the microservice providing clear context about its purpose.' });
        this._generator.option('contact-name', { type: String, alias: 'cn', required: true, description: 'Name of the contact person responsible for the microservice.' });
        this._generator.option('contact-email', { type: String, alias: 'ce', required: true, description: 'Email of the contact person responsible.' });
        this._generator.option('vault', { type: String, alias: 'v', required: true, description: 'The name of the vault for managing secrets and configurations.' });
    }
}
