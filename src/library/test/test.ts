import { execSync } from "child_process";

export async function test()
{
    execSync("jest --config src/[tests]/jest.config.ts", { stdio: "inherit" });
}
