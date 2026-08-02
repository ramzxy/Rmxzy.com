/*
 * The managed Windows workspace returns EISDIR when readlink() is called on a
 * regular file. Node normally returns EINVAL, which Next/webpack already knows
 * means "not a symlink". Normalize that one platform-specific error before
 * Next starts. This is a no-op on production Linux hosts.
 */
if (process.platform === "win32") {
  const fs = require("node:fs");

  const normalizeReadlinkError = (error) => {
    if (error?.code === "EISDIR") {
      error.code = "EINVAL";
    }
    return error;
  };

  const readlink = fs.readlink.bind(fs);
  fs.readlink = (path, ...args) => {
    const callback = args.pop();
    return readlink(path, ...args, (error, result) => {
      callback(normalizeReadlinkError(error), result);
    });
  };

  const readlinkSync = fs.readlinkSync.bind(fs);
  fs.readlinkSync = (path, ...args) => {
    try {
      return readlinkSync(path, ...args);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };

  const promisesReadlink = fs.promises.readlink.bind(fs.promises);
  fs.promises.readlink = async (path, ...args) => {
    try {
      return await promisesReadlink(path, ...args);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };
}

require("next/dist/bin/next");
