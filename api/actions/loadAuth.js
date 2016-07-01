import request from 'superagent';

export default function loadAuth(req) {
  return new Promise((resolve, reject) => {
    request
      .get('https://admin.audioverse.net/ajax/islogged')
      .end(function(err, res){
        if (err)
          reject(err);

        resolve(res.text && res.text !== 'null' ? res.text : null);
      });
  });
}
