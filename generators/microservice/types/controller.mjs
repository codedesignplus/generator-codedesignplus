export class ControllerModel {
    constructor(name) {
        name = name.trim();

        this.sufix = 'Controller';
        this.name = name;
        this.fullname = `${this.name}${this.sufix}`;
        this.file = `${this.fullname}.cs`;
    }
}
export function getController(name) {
    return new ControllerModel(name);
}