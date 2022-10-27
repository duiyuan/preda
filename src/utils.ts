import * as cp from "child_process";

export function exec(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cp.exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr);
        return;
      }
      resolve(stdout);
    });
  });
}
