import fse from "fs-extra";
import path from "path";
import { expect } from "chai";
import { download } from "../download";
import { test } from "../../__test__/test";

describe("[unit] download", () => {
  it(`should download and write file`, function () {
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

  it(`should not write the file if HTTP response status code != 200`, function () {
    const _pool = new download.Pool();
    _pool.add({
      dest: path.join(test.getOutputTestDirectory(), "404"),
      url: "https://httpstat.us/404",
    });
    return expect(_pool.download()).to.rejectedWith(
      Error,
      /response with status 404/
    );
  });

  it(`should response when AbortController is active`, () => {
    const _pool = new download.Pool();
    _pool.add({
      dest: path.join(test.getOutputTestDirectory(), "100mb.json"),
      url: "https://github.com/seductiveapps/largeJSON/raw/master/100mb.json",
    });

    return expect(
      Promise.all([
        // Start to download, and cancel after waiting for 300 ms
        _pool.download(),
        new Promise<void>((re) => {
          setTimeout(() => {
            _pool.cancel();
            re();
          }, 300);
        }),
      ])
    ).to.rejectedWith(Error, `The user aborted a request.`);
  });
});
