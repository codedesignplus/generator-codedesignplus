import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export default class DotNet {

    constructor(generator) {
        this._generator = generator;
    }

    removeProjects(options) {        
        this._generator.on('end', () => {

            if(!options.createProtoForAggregate) 
                this._removeProject('gRpc');
            
            if(!options.createControllerForAggregate) 
                this._removeProject('Rest');

            if(!options.createConsumer)
                this._removeProject('AsyncWorker');

        });
    }

    _removeProject(name) {
        const cwd = this._generator.destinationRoot();

        const results = spawnSync("dotnet", ["sln", "list"], { cwd: cwd, encoding: 'utf-8' });

        if (results.error)
            return;

        if (results.status !== 0)
            return;

        const solutionProjects = results.stdout.trim().split('\n').slice(1).map(project => project.replace('\r', ''));
        const projects = solutionProjects.filter(project => project.includes(name));

        for (const project of projects) {
            const removeResult = spawnSync("dotnet", ["sln", "remove", project], { cwd: cwd });

            if (removeResult.error)
                return;

            if (removeResult.status !== 0)
                return;

            const projectPath = path.join(this._generator.destinationRoot(), path.dirname(project));

            if (fs.existsSync(projectPath))
                fs.rmdir(projectPath, { recursive: true });
        }
    }

}