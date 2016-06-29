import config from '../../../src/config';
import fs from 'fs';
import path from 'path';

export default function newFolder(req) {
  return new Promise((resolve, reject) => {
    var newFolder = path.join(config.uploads.dir, req.body.folder);
    fs.mkdir(newFolder, (err, data) => {
      if (err)
        reject(err);

      resolve({message: 'Folder created succesfully'});
    });
  });
}