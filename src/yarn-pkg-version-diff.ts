#!/usr/bin/env node

interface PackageDefinition {
  identifier: string;
  version: string;
}

interface UpdatedPackageDefinition {
  name: string;
  from: string;
  to: string;
}

const packageIdentifiers = process.argv[2];
const initialLockFile = process.argv[3];
const updatedLockFile = process.argv[4];

if (!packageIdentifiers || !initialLockFile || !updatedLockFile) {
  console.log(
    `Usage: yarn-pkg-version-diff @namespace,package-name old-lock-file-string new-lock-file-string`
  );
  process.exit(1);
}

const targetedPackageIdentifiers = packageIdentifiers.split(",");

function parseLockFile(file: string): PackageDefinition[] {
  return file.split("\n").reduce((acc, line, index, lines) => {
    targetedPackageIdentifiers.forEach(identifier => {
      if (line.startsWith(identifier)) {
        const version = lines[index + 1]
          .split("version")
          .find(chunk => !!chunk.trim());

        if (!!version) {
          const packageIdentifier = line.match(
            new RegExp(`${identifier}[^@]*`, "g")
          )[0];
          acc.push({
            identifier: packageIdentifier,
            version: version.trim().replace(/"/g, "")
          });
        }
      }
    });
    return acc;
  }, []);
}

const initialLockFilePackages = parseLockFile(initialLockFile);
const updatedLockFilePackages = parseLockFile(updatedLockFile);
const updatedPackages: UpdatedPackageDefinition[] = [];

updatedLockFilePackages.forEach(updatedPackage => {
  for (const initialPackage of initialLockFilePackages) {
    if (
      initialPackage.identifier === updatedPackage.identifier &&
      initialPackage.version !== updatedPackage.version
    ) {
      updatedPackages.push({
        name: updatedPackage.identifier,
        from: initialPackage.version,
        to: updatedPackage.version
      });
      break;
    }
  }
});

if (updatedPackages.length > 0) {
  console.log(JSON.stringify(updatedPackages));
}
