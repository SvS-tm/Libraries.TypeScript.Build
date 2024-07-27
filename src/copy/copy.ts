import { existsSync } from "fs";
import { copyFile, mkdir } from "fs/promises";
import { glob } from "glob";
import { posix, win32 } from "path";

export async function copy
(
    source: string, 
    destination: string, 
    include?: string, 
    exclude?: string
)
{
    const currentDir = process.cwd().split(win32.sep).join(posix.sep);
    const absoluteSource = posix.join(currentDir, source);
    const absoluteDestination = posix.join(currentDir, destination);
    const includeGlob = posix.join(absoluteSource, include ?? "**");
    const included = await glob(includeGlob, { absolute: false, cwd: absoluteSource, posix: true, nodir: true, dot: true });
    const excluded = exclude 
        ? await glob(posix.join(absoluteSource, exclude), { absolute: false, posix: true, cwd: absoluteSource, nodir: true, dot: true })
        : [];

    const filesToCopy = included.filter((path) => !excluded.includes(path));

    if (!filesToCopy.length)
    {
        console.warn("Nothing to copy");
        return;
    }

    if(!existsSync(absoluteDestination))
        await mkdir(absoluteDestination, { recursive: true });
    
    await Promise.all
    (
        filesToCopy.map
        (
            async (path) =>
            {
                const dirName = posix.join(absoluteDestination, posix.dirname(path));
                const fileName = posix.basename(path);

                await mkdir(dirName, { recursive: true });

                const from = posix.join(absoluteSource, path);
                const to = posix.join(dirName, fileName);

                await copyFile(from, to);
            }
        )
    );
}
