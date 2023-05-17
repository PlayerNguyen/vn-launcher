import fetch from "node-fetch";
import pLimit from "p-limit";
import { promisify } from "util";
import { pipeline } from "stream";
import { createWriteStream } from "fs-extra";

const promisePipe = promisify(pipeline);

export module download {
  export type ItemStatus = "pending" | "failed" | "success";
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

      return Promise.all(processes);
    }

    public cancel(reason?: any) {
      return this.signalController.abort(reason);
    }
  }

  export async function fetchData(item: Item, controller: AbortController) {
    const response = await fetch(item.url, {
      signal: controller.signal,
    });
    const destStream = createWriteStream(item.dest);

    await promisePipe(response.body, destStream);

    return item;
  }
}
