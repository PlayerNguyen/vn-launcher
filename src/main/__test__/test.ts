import path from "path";

export module test {
  /**
   *
   * @returns the test output as directory
   */
  export function getOutputTestDirectory() {
    return path.join(__dirname, `../../../test-output`);
  }
}
