const express = require('express');
const request = require('request');
const app = express();

app.get('/stream', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('No URL provided');

  req.pipe(request(url)).pipe(res);
});

app.get('/', (req, res) => {
  res.send('🎉 M3U8 Restream Server is Running!');
});

app.listen(process.env.PORT || 3000);
