import { OptionValues, program } from "commander";
import { generateLicense } from "./generate-license";

export function register()
{
    program
        .command("license")
        .description("Generates license from template")
        .option("--package-meta <path>", "Path to package.json", "package.json")
        .option("--template <path>", "Path to license template file")
        .option("--destination <path>", "Destination path")
        .action
        (
            async (options: OptionValues) =>
                await generateLicense(options.packageMeta, options.template, options.destination)
        );
}
