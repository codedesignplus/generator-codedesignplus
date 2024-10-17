export default class BaseModel {
    _toPascalCase(value) {
        return value.replace(/(^\w|_\w)/g, match => match.replace('_', '').toUpperCase());
    }
    
    _validate(value, sufix) {
        if (!value) 
            throw new Error(`${sufix} name is required`); 
                
        const suffixRegex = new RegExp(`${sufix}$`, 'i');

        value = value.replace(suffixRegex, '').trim();

        value = this._toPascalCase(value);

        return value;
    }
}