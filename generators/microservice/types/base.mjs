export class BaseModel {
    _validate(value, sufix) {
        if (!value) 
            throw new Error(`${sufix} name is required`); 
                
        const suffixRegex = new RegExp(`${sufix}$`, 'i');

        value = value.replace(suffixRegex, '').trim();

        value = toPascalCase(value);

        return value;
    }
}

export function toPascalCase(value) {
    return value
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
        .join("");
}