import config from '../../../src/config';
import path from 'path';

export default function upload(req) {
  return new Promise((resolve, reject) => {
		req.file('files').upload({
		  dirname: path.join(path.resolve(config.uploads.dir), req.body.path),
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
          file['id'] = new Date().getTime() + '_' + file.filename;
          file['extension'] = path.extname(file.fd);
          file['name'] = path.basename(file.fd);
          file['mtime'] = new Date();
          return file;
        })
      });
    });
  });
}