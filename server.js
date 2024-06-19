const express = require('express');
const path = require('path');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/get-video-info', async (req, res) => {
    //'https://youtu.be/UT5F9AXjwhg?si=xJ83-DpXhqEue-Rr'
    let url = req.query.url;
    let type = 'videoandaudio';
    const info = await ytdl.getInfo(url);
    let formats = ytdl.filterFormats(info.formats,type);
    formats = formats.filter(format => format.container === 'mp4')
    const quality = formats.map(quality => ({
        quality: quality.qualityLabel,
        ratio: quality.width + 'X' + quality.height,
        itag:quality.itag,
        fileSize: quality.contentLength ? formatBytes(quality.contentLength) : 'N/A'
    }));
   let data = {
    videoDetails:{title:info.videoDetails.title, url: info.videoDetails.video_url},
    quality
   }
    res.json(data);
  });
  
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const mb = bytes / (k * k);
    return parseFloat(mb.toFixed(dm)) + ' MB';
}

// app.get('/download', (req, res) => {
//   console.log('download');
//    ytdl(req.query.url,{ quality: req.query.itag })
//    .on('error', (err) => res.status(500).send(err.message))
//    .pipe(res);
//   });

  
app.get('/download', (req, res) => {
  const url = req.query.url;
  const itag = req.query.itag;
  const videoStream = ytdl(url, { quality: itag });

  videoStream.on('response', (response) => {
    res.setHeader('Content-Length', response.headers['content-length']);
  });

  videoStream.on('error', (err) => res.status(500).send(err.message));
  videoStream.pipe(res);

  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
