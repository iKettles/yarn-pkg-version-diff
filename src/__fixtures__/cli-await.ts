import { exec } from "child_process";

export default async (
  packageIdentifier: string,
  initialYarnLock: string,
  updatedYarnLock: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    exec(
      `ts-node ${__dirname}/../yarn-pkg-version-diff.ts ${packageIdentifier} '${initialYarnLock}' '${updatedYarnLock}'`,
      (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }
        resolve(stdout || stderr);
      }
    );
  });
};
