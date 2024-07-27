import { execSync } from "child_process";
import { rm } from "fs/promises";
import { copy } from "../../copy/copy";
import { Barrelsby as barrelsby } from "barrelsby/bin";
import { fixBarrels } from "../../fix-barrels/fix-barrels";
import { join } from "path";

export async function build()
{
    await rm("obj", { recursive: true, force: true });

    execSync("tsc", { stdio: 'inherit' });

    await copy("src", "obj", undefined, "\\[tests\\]/**");

    barrelsby
    (
        {
            config: join(__dirname, "barrelsby.json"),
            directory: "./obj"
        }
    );

    await fixBarrels("./obj");

    execSync("tsc --project build/tsconfig.validate.json", { stdio: 'inherit' });
}
