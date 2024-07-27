import { OptionValues, program } from "commander";
import { fixBarrels } from "./fix-barrels";

export function register()
{
    program
        .command("fix-barrels")
        .description("Fixes barrels to have namespace/directory like exports")
        .option("--path <path>", "Root path where barrels should be processed")
        .action
        (
            async (options: OptionValues) =>
                await fixBarrels(options.path)
        );
}
