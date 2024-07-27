import { program } from "commander";
import { init } from "./init";

export function register()
{
    program
        .command("init-lib")
        .description("Initializes library (adds some non-movable scripts into repo)")
        .action(init);
}
