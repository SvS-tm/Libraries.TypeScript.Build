import { existsSync } from "fs";
import { copyFile, mkdir } from "fs/promises";
import { glob } from "glob";
import { dirname, join } from "path";

export async function init()
{
    const basePath = join(__dirname, "init");
    const buildAssets = await glob("**", { cwd: basePath, absolute: false, nodir: true, posix: true, dot: true });

    await Promise.all
    (
        buildAssets.map
        (
            async (asset) => 
            {
                const directory = dirname(asset);

                if (!existsSync(directory))
                    await mkdir(directory, { recursive: true });

                console.log(asset);
                
                await copyFile
                (
                    join(basePath, asset),
                    asset
                );
            }
        )
    );
}
