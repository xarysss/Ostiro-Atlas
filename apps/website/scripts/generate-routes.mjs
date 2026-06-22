import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const routes = [
  "fonctionnalites", "patrimoine", "investissements", "budget", "dividendes",
  "frais", "fiabilite", "securite", "local-first", "imports-csv",
  "simulateurs", "tarifs", "telecharger", "guide-demarrage",
];
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "dist", "index.html");
const index = await readFile(indexPath, "utf8");

await Promise.all(routes.map(async (route) => {
  const destination = join(root, "dist", route);
  await mkdir(destination, { recursive: true });
  await writeFile(join(destination, "index.html"), index, "utf8");
}));

await copyFile(indexPath, join(root, "dist", "404.html"));
