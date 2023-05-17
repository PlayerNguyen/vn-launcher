import fse from "fs-extra";
import path from "path";
import { expect } from "chai";
import { download } from "../download";
import { test } from "../../__test__/test";

describe("[unit] download", () => {
  it(`should download and write file`, async function () {
    // Long duration test
    this.timeout(4000);

    // Create a pool
    const _pool = new download.Pool();
    _pool.add({
      dest: path.join(test.getOutputTestDirectory(), "200"),
      url: "https://httpstat.us/200",
    });
    const downloadTask = async () => {
      // Start to download
      const response: download.Item[] = await _pool.download();

      // Check if exists
      return response
        .map((item) => {
          return fse.existsSync(item.dest);
        })
        .every((_) => _ === true);
    };

    return expect(downloadTask()).to.eventually.be.true;
  });
});
