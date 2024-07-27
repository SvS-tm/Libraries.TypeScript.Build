import { execSync } from "child_process";
import { rm } from "fs/promises";
import { join } from "path";
import { replaceTscAliasPaths, ReplaceTscAliasPathsOptions } from "tsc-alias";
import { copy } from "../../copy/copy";
import { generateLicense } from "../../license/generate-license";
import { generateReleaseArtifact } from "../../release-artifact/generate-release-artifact";

export async function pack()
{
    console.log("Cleaning bin");
    await rm("bin", { recursive: true, force: true });

    console.log("Compiling declarations");
    execSync
    (
        `tsc \
        --project build/tsconfig.declarations.json`, 
        { stdio: 'inherit' }
    );

    console.log("Fixing declarations import paths");
    await replaceTscAliasPaths
    (
        {
            project: "build/tsconfig.declarations.json"
        } as ReplaceTscAliasPathsOptions
    );
    
    console.log("Transpiling with babel");
    execSync
    (
        `babel \
        . \
        --out-dir ../bin \
        --config-file ${join(__dirname, "babel.config.cts")} \
        --extensions .ts,.tsx \
        --ignore **/*.d.ts \
        --source-maps \
        --copy-files`, 
        { stdio: 'inherit', cwd: "obj" }
    );

    console.log("Generating license");
    await generateLicense("package.json", join(__dirname, "LICENSE"), "bin/LICENSE");

    console.log("Copying package.json");
    await copy(".", "bin", "package.json");

    console.log("Packing");
    execSync("pnpm pack --dir bin", { stdio: 'inherit' });

    console.log("Copying npmrc");
    await copy(".", "bin/.release-artifact", ".npmrc");

    console.log("Generating release artifact");
    await generateReleaseArtifact("./bin", [ { glob: "*.tgz", label: "package" } ]);
}
