import { readFile, rm, writeFile } from "fs/promises";
import { BarrelProcessingInfo } from "./types/barrel-processing-info";
import { BarrelProcessingOperation } from "./types/barrel-processing-information";

export async function fixBarrelFile(path: string): Promise<BarrelProcessingInfo>
{
    const text = await readFile(path, { encoding: "utf-8" });

    const originalLines = text
        .split("\n")
        .filter(line => line.match(/export \* from ".*";/));

    const processedLines = originalLines
        .filter(line => !line.match(/export \* from "\..*\/index";/));

    if (processedLines.length <= 0)
    {
        await rm(path, { force: true, maxRetries: 5 });

        return {
            operation: BarrelProcessingOperation.Delete,
            path
        };
    }
    else
    {
        const result = processedLines.join("\n");
    
        await writeFile(path, result, { encoding: "utf-8" });

        return {
            operation: BarrelProcessingOperation.Clean,
            path,
            cleanedExports: originalLines.length - processedLines.length
        };
    }
}
