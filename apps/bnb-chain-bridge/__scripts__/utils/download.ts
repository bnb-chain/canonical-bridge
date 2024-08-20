/* eslint-disable no-console */
import path from 'path';
import fs from 'fs';

import download from 'download';
import PQueue from 'p-queue';
import sharp from 'sharp';

const taskQueue = new PQueue();

export function downloadIcons(params: {
  outputDir: string;
  logDir: string;
  urlsMap: Record<number | string, string>;
}) {
  const { outputDir, logDir, urlsMap } = params;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {
      recursive: true,
    });
  }

  const successMap: Record<number | string, boolean> = {};
  const failureMap: Record<number | string, string> = {};

  const files = fs.readdirSync(outputDir);
  files.forEach((name) => {
    const key = path.parse(name).name;
    successMap[key] = true;
  });

  const total = Object.values(urlsMap).length;
  let successCount = 0;
  let failureCount = 0;

  const createTask = async (key: number | string, url: string) => {
    const handleFailure = () => {
      failureMap[key] = url;
      failureCount++;
    };

    const handleSuccess = () => {
      successMap[key] = true;
      successCount++;
    };

    try {
      if (successMap[key]) {
        handleSuccess();
      } else {
        const iconPath = path.resolve(outputDir, `${key.toString().toUpperCase()}.png`);

        const data = await download(url);

        await sharp(data)
          .resize(100)
          .png({
            compressionLevel: 8,
            quality: 80,
            force: true,
          })
          .toFile(iconPath, (err: any) => {
            if (err) {
              handleFailure();
            } else {
              handleSuccess();
            }
          });
      }
    } catch (err) {
      handleFailure();
    } finally {
      console.log(`progress: ${successCount + failureCount}/${total}, failure: ${failureCount}`);
    }
  };

  Object.entries(urlsMap).forEach(([key, url]) => {
    taskQueue.add(async () => createTask(key, url));
  });

  taskQueue.on('idle', () => {
    const failureLogPath = path.resolve(logDir, 'failure.json');
    fs.writeFileSync(failureLogPath, JSON.stringify(failureMap, null, 4));
    console.log('finished!');
  });
}
