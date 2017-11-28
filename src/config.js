require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    org: 'AudioVerse',
    title: 'Media Uploader Manager',
    description: '',
    head: {
      titleTemplate: 'Media Uploader Manager: %s',
      meta: [
        {name: 'description', content: ''},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Media Uploader Manager'},
        {property: 'og:image', content: 'http://admin.audioverse.net:8080/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'Media Uploader Manager'},
        {property: 'og:description', content: ''},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },
  uploads: {
    dir: '../uploads/media-staging',
    maxBytes: 20000000000
  },

}, environment);
