import { program } from "commander";
import meta from "../package.json";
import { register as registerFixBarrels } from "./fix-barrels/register";
import { register as registerGenerateLicense } from "./license/register";
import { register as registerReleaseArtifact } from "./release-artifact/register";
import { register as registerCopy } from "./copy/register";
import { register as registerBuild } from "./library/build/register";
import { register as registerTest } from "./library/test/register";
import { register as registerPack } from "./library/pack/register";

program
    .name(meta.name)
    .description(meta.description)
    .version(meta.version);

registerGenerateLicense();
registerReleaseArtifact();
registerFixBarrels();
registerCopy();
registerBuild();
registerTest();
registerPack();

await program.parseAsync(process.argv);
