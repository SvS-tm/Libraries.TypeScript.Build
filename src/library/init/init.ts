import { existsSync } from "fs";
import { copyFile, mkdir } from "fs/promises";
import { glob } from "glob";
import { basename } from "path";

export async function init()
{
    const buildAssets = await glob("tsconfig.*", { cwd: __dirname, absolute: true, nodir: true, posix: true });

    if (!existsSync("build"))
        await mkdir("build");

    await Promise.all
    (
        buildAssets.map
        (
            (asset) => copyFile
            (
                asset,
                basename(asset)
            )
        )
    );
}
