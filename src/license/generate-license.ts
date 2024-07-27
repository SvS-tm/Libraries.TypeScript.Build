import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { dirname } from "path";

export async function generateLicense(packageMeta: string, template: string, destination: string)
{
    const licenseTemplate = await readFile(template, { encoding: 'utf-8' });
    const packageConfig = JSON.parse(await readFile(packageMeta, { encoding: 'utf-8' }));

    const year = new Date().getUTCFullYear();
    const author = packageConfig.author;

    const result = licenseTemplate
        .replace('[year]', year.toString())
        .replace('[author]', author);

    const outputPath = destination;
    const outputPathDirectory = dirname(outputPath);

    if (!existsSync(outputPathDirectory))
        mkdirSync(outputPathDirectory, { recursive: true });

    await writeFile(outputPath, result, { encoding: 'utf-8' });
}
