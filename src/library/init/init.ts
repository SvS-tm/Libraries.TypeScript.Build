import { existsSync } from "fs";
import { copyFile, mkdir } from "fs/promises";
import { glob } from "glob";
import { dirname, join } from "path";

export async function init()
{
    const buildAssets = await glob("**", { cwd: join(__dirname, "init"), absolute: false, nodir: true, posix: true, dot: true });

    await Promise.all
    (
        buildAssets.map
        (
            async (asset) => 
            {
                const directory = dirname(asset);

                if (!existsSync(directory))
                    await mkdir(directory, { recursive: true });
            
                await copyFile
                (
                    join(__dirname, asset),
                    asset
                );
            }
        )
    );
}
