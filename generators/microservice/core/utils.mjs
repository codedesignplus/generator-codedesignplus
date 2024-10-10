import { findUp } from 'find-up';
import path from 'path';

export default class Utils {
    constructor(generator) {
        this._generator = generator;
    }

    async setPathBase() {
        const filePath = await findUp('archetype.json');

        if (!filePath) {
            throw new Error('No se encontró el archivo archetype.json');
        }

        const pathBaseDir = path.dirname(filePath);

        this._generator.destinationRoot(pathBaseDir);
    }

    async readArchetypeMetadata() {
        const archetypeFile = await findUp('archetype.json');

        if (!archetypeFile) {
            throw new Error('No se encontró el archivo archetype.json');
        }

        return await this._generator.fs.readJSON(archetypeFile);
    }
}