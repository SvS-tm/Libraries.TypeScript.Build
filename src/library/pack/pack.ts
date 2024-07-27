import { execSync } from "child_process";
import { rm } from "fs/promises";
import { replaceTscAliasPaths, ReplaceTscAliasPathsOptions } from "tsc-alias";
import { copy } from "../../copy/copy";
import { generateLicense } from "../../license/generate-license";
import { generateReleaseArtifact } from "../../release-artifact/generate-release-artifact";

export async function pack()
{
    await rm("bin", { recursive: true, force: true });

    execSync
    (
        "tsc \
        --project build/tsconfig.declarations.json", 
        { stdio: 'inherit' }
    );

    await replaceTscAliasPaths
    (
        {
            project: "build/tsconfig.declarations.json"
        } as ReplaceTscAliasPathsOptions
    );
    
    execSync
    (
        "babel \
        obj \
        --out-dir ../bin \
        --config-file \
        ../build/babel.config.cts \
        --extensions .ts,.tsx \
        --ignore **/*.d.ts \
        --source-maps \
        --copy-files", 
        { stdio: 'inherit' }
    );

    await generateLicense("package.json", "build/LICENSE", "bin/LICENSE");

    await copy(".", "bin", "package.json");

    execSync("pnpm pack --dir bin", { stdio: 'inherit' });

    await copy(".", "bin/.release-artifact", ".npmrc");

    await generateReleaseArtifact("./bin", [ { glob: "*.tgz", label: "package" } ]);
}
