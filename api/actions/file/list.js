import config from '../../../src/config';
import fs from 'fs';
import path from 'path';

export default function list(req) {
  return new Promise((resolve, reject) => {
    var pathToRead = req.query.path ? config.uploads.dir + req.query.path : config.uploads.dir;
		fs.readdir(pathToRead, (err, data) => {
      if (err)
        reject(err);
      
      resolve(
        data.map(function (file) {
          var stat = fs.statSync( path.join(pathToRead, file) );
          return { id: new Date().getTime() + '_' + file, type: stat.isFile() ? 'file' : 'folder', size: stat.size, mtime: stat.mtime, name: file, extension: path.extname(file) }
        })
      );
    });
  });
}