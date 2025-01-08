import { toPascalCase, BaseModel } from "./base.mjs";

export class AppSettingsModel extends BaseModel {
    constructor(answers, microservice, organization) {
        super();

        this.sufix = '';
        this.appName = `ms-${microservice.toLowerCase()}`;
        this.database = `db-ms-${microservice.toLowerCase()}`;
        this.description = answers.description;
        this.business = organization;
        this.vault = answers.vault;

        this.contact = {
            name: answers.contactName,
            email: answers.contactEmail.toLowerCase()
        };
    }

    static from(answers, microservice, organization) {
        if(!answers || !answers.contactName || !answers.contactEmail || !microservice || !organization)
            return null;

        return new AppSettingsModel(answers, toPascalCase(microservice), toPascalCase(organization));
    }
}