import { execSync } from "child_process";
import { rm } from "fs/promises";
import { copy } from "../../copy/copy";
import { Barrelsby as barrelsby } from "barrelsby/bin";
import { fixBarrels } from "../../fix-barrels/fix-barrels";
import { join } from "path";

export async function build()
{
    console.log("Cleaning obj");
    await rm("obj", { recursive: true, force: true });

    console.log("Validating TypeScript");
    execSync("tsc", { stdio: 'inherit' });

    console.log("Copying sources");
    await copy("src", "obj", undefined, "\\[tests\\]/**");

    console.log("Generating barrels");
    barrelsby
    (
        {
            config: join(__dirname, "barrelsby.json"),
            directory: "obj",
            location: "all",
            exclude: [ ".*\\.d\\.ts" ],
            delete: true,
            verbose: true
        }
    );

    await fixBarrels("obj");

    console.log("Validating TypeScript output");
    execSync("tsc --project build/tsconfig.validate.json", { stdio: 'inherit' });
}
