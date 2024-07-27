import { program } from "commander";
import { build } from "./build";

export function register()
{
    program
        .command("build-lib")
        .description("Builds & validates project to intermediate directory (obj)")
        .action(build);
}
