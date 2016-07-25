import config from '../../../src/config';
import path from 'path';
import fs from 'fs';

export default function upload(req) {
  return new Promise((resolve, reject) => {
    const dirname = path.join(path.resolve(config.uploads.dir), req.body.path);
		req.file('files').upload({
		  dirname: dirname,
      maxBytes: config.uploads.maxBytes,
      saveAs: function(__newFileStream,cb) {
        cb(null, __newFileStream.filename);
      }
    }, function (err, files) {
      if (err)
        reject(err);

      resolve({
        message: files.length + ' file(s) uploaded successfully!',
        files: files.map(function (file) {
          var stat = fs.statSync( path.join(dirname, file.filename) );
          file['id'] = new Date().getTime() + '_' + file.filename;
          file['extension'] = path.extname(file.fd);
          file['name'] = path.basename(file.fd);
          file['mtime'] = new Date();
          file['size'] = stat.size;
          return file;
        })
      });
    });
  });
}
