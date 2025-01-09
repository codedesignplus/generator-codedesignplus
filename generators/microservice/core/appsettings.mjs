import path from 'path';

export default class AppSettingsGenerator {

    constructor(utils, generator) {
        this._utils = utils;
        this._generator = generator;
        this.name = 'appsettings';
    }

    async generate(options) {

        const sources = [
            options.paths.src.rest,
            options.paths.src.grpc,
            options.paths.src.asyncWorker
        ]

        sources.forEach(source => {

            const appSettingsFile = this._generator.destinationPath(path.join(source, 'appsettings.json'));

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
            const file = path.join('resources', 'shared', 'vault', 'config.sh');

            const configFile = this._generator.destinationPath(file);

            let config = this._generator.fs.read(configFile);

            const vault = options.appSettings.vault.toLowerCase();
    
            config = config.replace(/archetype-keyvalue/g, `${vault}-keyvalue`);
            config = config.replace(/archetype-database/g, `${vault}-database`);
            config = config.replace(/archetype-rabbitmq/g, `${vault}-rabbitmq`);
            config = config.replace(/archetype-transit/g, `${vault}-transit`);
            config = config.replace(/archetype-approle/g, `${vault}-approle`);
    
            config = config.replace(/db-ms-archetype/g, options.appSettings.database);
            config = config.replace(/ms-archetype/g, options.appSettings.appName);
    
            this._generator.fs.write(configFile, config);
        } catch (error) {
            console.log('No se encontró el archivo config.sh');
            console.log(error);
        }    
    }

    getArguments() {
        this._generator.option('description', { type: String, alias: 'd', required: true, description: 'A detailed description of the microservice providing clear context about its purpose.' });
        this._generator.option('contact-name', { type: String, alias: 'cn', required: true, description: 'Name of the contact person responsible for the microservice.' });
        this._generator.option('contact-email', { type: String, alias: 'ce', required: true, description: 'Email of the contact person responsible.' });
        this._generator.option('vault', { type: String, alias: 'v', required: true, description: 'The name of the vault for managing secrets and configurations.' });
    }
}
