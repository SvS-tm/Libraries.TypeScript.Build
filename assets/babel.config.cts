import type { TransformOptions } from "@babel/core";
import { dirname, posix, relative, resolve, sep } from "path";

export default 
{
    presets: [
        "@babel/preset-typescript",
        [
            "@babel/preset-env",
            {
                targets: "> 0.25%, not dead", // Adjust according to your target environments
                useBuiltIns: false // This ensures Babel won't include polyfills
            }
        ]
    ],
    plugins: [
        [
            "module-resolver",
            {
                root: ["."],
                resolvePath: (sourcePath: string, currentFile: string) =>
                {
                    const base = dirname(currentFile);

                    if (currentFile.endsWith("index.ts"))
                        return sourcePath;

                    const path = resolve(sourcePath);
                    
                    let result = relative(base, path);

                    if (!result.startsWith("."))
                        result = `./${result}`;

                    const transformedResult = result.split(sep).join(posix.sep);

                    return transformedResult;
                }
            }
        ]
    ]
} satisfies TransformOptions;
