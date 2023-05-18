import fetch from "node-fetch";
import pLimit from "p-limit";
import { promisify } from "util";
import { pipeline } from "stream";
import { createWriteStream } from "fs-extra";

const promisePipe = promisify(pipeline);

export module download {
  export type ItemStatus =
    | "pending"
    | "failed"
    | "success"
    | "downloading"
    | "writing";
  export interface Item {
    url: string;
    dest: string;
    status?: ItemStatus;
  }

  export interface PoolOptions {
    concurrency?: number;
  }

  export class Pool {
    private limitFn: pLimit.Limit;
    private awaiter: Item[] = new Array();
    private signalController: AbortController = new AbortController();

    constructor(options?: PoolOptions) {
      this.limitFn = pLimit(options?.concurrency || 4);
    }

    public add(...items: Item[]) {
      return items.forEach((item) => {
        // Add if the status is not defined at the beginning
        if (item.status === undefined) {
          item.status = "pending";
        }

        // Push this into awaiter
        this.awaiter.push(item);
      });
    }

    public getAwaiter() {
      return this.awaiter;
    }

    public download() {
      const processes: Promise<Item>[] = [];

      this.awaiter.forEach((item) =>
        processes.push(
          this.limitFn(() => fetchData(item, this.signalController))
        )
      );

      // Then clear all item in awaiter
      this.awaiter = [];

      return Promise.all(processes);
    }

    /**
     * Download the latest item that added into the awaiter.
     *
     * @returns the promise of the download process
     */
    public async downloadLast() {
      const last = this.awaiter.pop();
      if (last === undefined) {
        throw new Error(`The pool await items is empty.`);
      }

      return await this.limitFn(() => fetchData(last, this.signalController));
    }

    public cancel(reason?: any) {
      return this.signalController.abort(reason);
    }
  }

  export async function fetchData(item: Item, controller: AbortController) {
    // Trying to download
    const response = await fetch(item.url, {
      signal: controller.signal,
    });
    item.status = "downloading";

    // If the response is not success, throw an Error
    if (response.status !== 200) {
      item.status = "failed";
      throw new Error(`${item.url} response with status ${response.status}.`);
    }

    item.status = "writing";
    const destStream = createWriteStream(item.dest);
    await promisePipe(response.body, destStream);
    item.status = "success";

    return item;
  }

  export function createDownloadItem(url: string, dest: string): Item {
    return {
      url,
      dest,
      status: "pending",
    };
  }
}
