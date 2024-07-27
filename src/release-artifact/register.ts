import { OptionValues, program } from "commander";
import { AssetInput } from "./types/asset-input";
import { generateReleaseArtifact } from "./generate-release-artifact";

export function register()
{
    program
        .command("release-artifact")
        .description("Generates release artifact directory with contents")
        .option("--base-path <path>", "Base path where all input globs will be executed")
        .option
        (
            "--files <files>", "Files which to process (in format <glob>|<label:optional>;<glob>|<label:optional>)", 
            (value) => value
                .split(';')
                .map
                (
                    (input): AssetInput => 
                    {
                        const [glob, label] = input.split('|');

                        return { glob, label };
                    }
                )
        )
        .action
        (
            async (options: OptionValues) =>
                await generateReleaseArtifact(options.basePath, options.files)
        );
}
