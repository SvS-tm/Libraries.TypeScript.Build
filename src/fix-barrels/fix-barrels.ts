import { glob } from "glob";
import { fixBarrelFile } from "./fix-barrel-file";
import { BarrelProcessingOperation } from "./types/barrel-processing-information";

export async function fixBarrels(path: string)
{
    const paths = await glob("**/index.ts", { absolute: true, cwd: path, nodir: true });

    console.log("Detected barrels", paths.length);

    const results = await Promise.all(paths.map(path => fixBarrelFile(path)));

    const deleted = results.filter(info => info.operation === BarrelProcessingOperation.Delete);
    const cleaned = results.filter(info => info.operation === BarrelProcessingOperation.Clean);

    console.log
    (
        "Post barrel processing info", 
        {
            deleted: deleted.length,
            cleaned: cleaned.length,
            totalCleanedExports: cleaned.reduce
            (
                (previous, current) => current.operation === BarrelProcessingOperation.Clean 
                    ? current.cleanedExports + previous 
                    : previous, 
                0
            )
        }
    );
}
