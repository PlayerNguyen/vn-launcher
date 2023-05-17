import fse from "fs-extra";
import { test } from "./test";
import chaiAsPromised from "chai-as-promised";
import chai from "chai";

export async function mochaGlobalSetup() {
  console.log(`Test output: ${test.getOutputTestDirectory()}`);
  fse.emptyDirSync(test.getOutputTestDirectory());

  // Setup chai-as-promised
  chai.use(chaiAsPromised);
}

export async function mochaGlobalTeardown() {}
