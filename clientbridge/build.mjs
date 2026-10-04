import { mkdir, copyFile, rm } from 'node:fs/promises';
const target = new URL('./dist/', import.meta.url);
await rm(target, {recursive:true, force:true});
await mkdir(target, {recursive:true});
for (const file of ['index.html','styles.css','app.mjs','core.mjs','scenarios.mjs','extra-scenarios.mjs','practice.mjs']) {
  await copyFile(new URL(file, import.meta.url), new URL(file, target));
}
console.log('Built 7 static assets in clientbridge/dist. No runtime dependencies.');
