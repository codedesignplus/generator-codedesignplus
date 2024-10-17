import BaseModel from "./base.mjs";

export class ControllerModel extends BaseModel {

    constructor(controller) {
        super();
        
        this.sufix = 'Controller';
        this.name = this._validate(controller, this.sufix);
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }

    static from(value) {
        return new ControllerModel(value);
    }
}