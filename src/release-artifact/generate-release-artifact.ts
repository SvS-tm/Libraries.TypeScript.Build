import { existsSync } from "fs";
import { copyFile, mkdir, writeFile } from "fs/promises";
import { glob } from "glob";
import { basename, dirname, join } from "path";
import { AssetInput } from "./types/asset-input";
import { ReleaseManifest } from "./types/release-manifest";

export async function generateReleaseArtifact(basePath: string, files: AssetInput[]): Promise<void>
{
    const groups = await Promise.all
    (
        files.map
        (
            async (input) => 
            (
                {
                    paths: await glob(input.glob, { cwd: basePath, absolute: false }),
                    label: input.label
                }
            )
        )
    );

    const assets = groups.flatMap((group) => group.paths.map(path => ({ path, label: group.label })));

    const manifest: ReleaseManifest = 
    {
        meta: "package.json",
        assets: assets.map
        (
            (asset) => 
            (
                {
                    name: basename(asset.path),
                    path: asset.path,
                    label: asset.label
                }
            )
        )
    };

    const content = JSON.stringify(manifest);

    const artifactPath = join(basePath, ".release-artifact");

    if (!existsSync(artifactPath))
        await mkdir(artifactPath);

    await writeFile
    (
        join(artifactPath, "release-manifest.json"), 
        content, 
        { encoding: "utf-8" }
    );

    assets.push({ path: 'package.json', label: undefined });

    await Promise.all
    (
        assets.map
        (
            async (asset) =>
            {
                const path = join(basePath, asset.path);
                const directory = dirname(path);

                if (!existsSync(directory))
                    await mkdir(directory, { recursive: true });

                await copyFile
                (
                    path,
                    join(artifactPath, asset.path)
                );
            }
        )
    );
}
