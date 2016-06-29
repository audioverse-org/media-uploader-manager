import config from '../../../src/config';
import fs from 'fs';
import path from 'path';

export default function newFolder(req) {
  return new Promise((resolve, reject) => {
    var file = path.join(config.uploads.dir, req.body.file);
    var newName = path.join(config.uploads.dir, req.body.newName);
    fs.rename(file, newName, (err) => {
      if (err)
        reject(err);
      
      resolve({message: 'Succesfully renamed'});
    });
  });
}