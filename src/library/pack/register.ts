import { program } from "commander";
import { pack } from "./pack";

export function register()
{
    program
        .command("pack-lib")
        .description
        (
            "Packs & transpiles (using babel) intermediate build results, \
            and prepares build artifact directory"
        )
        .action(pack);
}
