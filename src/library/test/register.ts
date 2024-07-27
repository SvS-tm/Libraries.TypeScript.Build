import { program } from "commander";
import { test } from "./test";

export function register()
{
    program
        .command("test-lib")
        .description("Runs tests using jest")
        .action(test);
}
