import { execSync } from "child_process";
import { existsSync } from "fs";
import { copyFile, mkdir, rm, rmdir, writeFile } from "fs/promises";
import { glob } from "glob";
import { basename, dirname, join } from "path";

type Asset = 
{
    name?: string;
    path: string;
    label?: string;
};

type ReleaseManifest =
{
    meta: string;
    assets: Asset[];
};

async function pack()
{
    if (existsSync("bin"))
        await rm("bin", { force: true, recursive: true });

    await mkdir("bin");

    const intermediateResults = await glob("**", { absolute: false, cwd: "obj", posix: true, nodir: true, dot: true });

    await Promise.all
    (
        intermediateResults.map
        (
            async (path) => 
            {
                const source = join("obj", path);
                const destination = join("bin", path);

                const destinationDirectory = dirname(destination);

                if (!existsSync(destinationDirectory))
                    await mkdir(destinationDirectory, { recursive: true });

                await copyFile(source, destination);
            }
        )
    );

    const npmignore = [
        ".release-artifact/",
        "*.tgz",
        "!.npmrc",
        ""
    ];

    await writeFile("bin/.npmignore", npmignore.join("\n"), { encoding: "utf-8", flag: "w" });

    const assets = await glob("**", { absolute: false, cwd: "assets", posix: true, nodir: true, dot: true });

    await Promise.all
    (
        assets.map
        (
            async (asset) =>
            {
                const source = join("assets", asset);
                const destination = join("bin", asset);

                const destinationDirectory = dirname(destination);

                if (!existsSync(destinationDirectory))
                    await mkdir(destinationDirectory, { recursive: true });

                await copyFile
                (
                    source,
                    destination
                );
            }
        )
    );

    await copyFile("package.json", "bin/package.json");

    execSync("pnpm pack --dir bin", { stdio: "inherit" });

    const packages = await glob("*.tgz", { cwd: "bin", absolute: false, posix: true, nodir: true });

    const releaseAssets = packages.map<Asset>
    (
        (path) =>
        (
            {
                name: basename(path),
                path,
                label: "package"
            }
        )
    );

    const manifest: ReleaseManifest = {
        meta: "package.json",
        assets: releaseAssets
    };

    const content = JSON.stringify(manifest);

    const artifactPath = join("bin", ".release-artifact");

    if (!existsSync(artifactPath))
        await mkdir(artifactPath);

    await copyFile(".npmrc", join(artifactPath, ".npmrc"));

    await writeFile
    (
        join(artifactPath, "release-manifest.json"), 
        content, 
        { encoding: "utf-8" }
    );

    releaseAssets.push({ path: 'package.json', label: undefined });

    await Promise.all
    (
        releaseAssets.map
        (
            async (asset) =>
            {
                const path = join("bin", asset.path);
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

pack();
