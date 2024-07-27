import { OptionValues, program } from "commander";
import { copy } from "./copy";

export function register()
{
    program
        .command("copy")
        .description("Copies files from source to destination matched by globs")
        .option("--source <path>", "Base directory where files should be copied from (recursively)")
        .option("--destination <path>", "Destination directory where files will be copied to (preserving tree structure)")
        .option("--include [glob]", "Include glob, which will filter files to include")
        .option("--exclude [glob]", "Exclude glob, which will filter files to exclude")
        .action
        (
            async (options: OptionValues) =>
                await copy(options.source, options.destination, options.include, options.exclude)
        );
}
