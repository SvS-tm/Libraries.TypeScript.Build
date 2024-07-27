import { execSync } from "child_process";

export async function test()
{
    console.log("Running jest");
    execSync("jest --config src/[tests]/jest.config.ts", { stdio: "inherit" });
}
