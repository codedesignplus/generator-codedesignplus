import { toPascalCase, BaseModel } from "./base.mjs";

export class AppSettingsModel extends BaseModel {
    constructor(answers) {
        super();

        this.sufix = '';
        this.appName = `ms-${answers.microservice.toLowerCase()}`;
        this.database = `db-ms-${answers.microservice.toLowerCase()}`;
        this.description = answers.description;
        this.business = answers.organization;
        this.vault = answers.vault;

        this.contact = {
            name: answers.contactName,
            email: answers.contactEmail.toLowerCase()
        };
    }

    static from(answers) {
        if(!answers || !answers.contactName || !answers.contactEmail)
            return null;

        return new AppSettingsModel(answers);
    }
}