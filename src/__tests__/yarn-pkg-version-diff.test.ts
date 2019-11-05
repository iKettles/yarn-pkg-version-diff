import * as fs from "fs";
import cliFixture from "../__fixtures__/cli-await";

const initialYarnLockFile = fs.readFileSync(
  `${__dirname}/../__fixtures__/initial-yarn.lock`,
  "utf8"
);
const updatedYarnLockFile = fs.readFileSync(
  `${__dirname}/../__fixtures__/updated-yarn.lock`,
  "utf8"
);

// @TODO Implement tests for packages targeted using namespace e.g. @atlaskit

describe("yarn-lock-diff.ts", () => {
  describe("Calculate difference between 2 identical yarn.lock files", () => {
    it("Should not detect any package updates", async () => {
      const output = await cliFixture(
        "office-ui-fabric-react",
        initialYarnLockFile,
        initialYarnLockFile
      );
      expect(output).toEqual("");
    });
  });

  describe("Calculate difference between a yarn.lock file with a more up to date version of office-ui-fabric-react", () => {
    it("Should determine that office-ui-fabric-react was updated from 7.32.0 to 7.34.0", async () => {
      const output = await cliFixture(
        "office-ui-fabric-react",
        initialYarnLockFile,
        updatedYarnLockFile
      );
      try {
        const parsedOutput = JSON.parse(output);
        expect(parsedOutput).toEqual([
          {
            name: "office-ui-fabric-react",
            from: "7.32.0",
            to: "7.34.0"
          }
        ]);
      } catch (err) {
        throw err;
      }
    });
  });
});
