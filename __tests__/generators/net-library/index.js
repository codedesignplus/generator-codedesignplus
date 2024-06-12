import 'regenerator-runtime/runtime'; // Importa para async/await
import '@babel/polyfill'; // Importa para otras características de ES6+
import { equal, file, fileContent } from 'yeoman-assert';
import { run } from 'yeoman-test';

describe('generator-codedesignplus:net-library', () => {
    
    beforeAll(() => {
        return run(path
            .join(__dirname, '../generators/net-library'))
            .withPrompts({
                organization: 'ExampleOrg',
                name: 'ExampleProject'
            });
    });

    it('prompting method sets answers correctly', () => {
        equal(generator.answers.organization, 'ExampleOrg');
        equal(generator.answers.name, 'ExampleProject');
    });

    //   it('initializing method copies templates from submodules', () => {
    //     file(['template/path/to/copied/file.js']);
    //     // Agrega más aserciones según sea necesario para verificar qué archivos se copiaron
    //   });

    //   it('writing method transforms and copies files to destination', () => {
    //     const library = 'ExampleOrg.Net.ExampleProject';
    //     fileContent('destination/path/to/copied/file.js', new RegExp(library, 'g'));
    //     // Agrega más aserciones según sea necesario para verificar la transformación y copia de archivos
    //   });
});
