import config from '../../../src/config';
import fs from 'fs';
import path from 'path';
import rmdir from 'rmdir';

export default function deleteFile(req) {
  return new Promise((resolve, reject) => {
    var file = path.join(config.uploads.dir, req.body.file);
    if (fs.statSync( file ).isFile()) {
      fs.unlink(file, (err) => {
        if (err)
          reject(err);
          
        resolve({message: 'Succesfully deleted'});
      });
    } else {
      rmdir(file, function (err, dirs, files) {
        if (err)
          reject(err);
          
        resolve({message: 'Succesfully deleted'});
      });
    }
  });
}