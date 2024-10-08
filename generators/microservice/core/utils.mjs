import { findUp } from 'find-up';

export default class Utils {
    constructor(generator) {
        this.generator = generator;
    }

    async readArchetypeMetadata() {
        const archetypeFile = await findUp('archetype.json');

        if (!archetypeFile) {
            throw new Error('No se encontró el archivo archetype.json');
        }

        return await this.generator.fs.readJSON(archetypeFile);
    }
}