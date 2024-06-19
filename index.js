const fs = require('fs');
const ytdl = require('ytdl-core');
async function info(){
    let type = 'videoandaudio';
    const info = await ytdl.getInfo('https://youtu.be/UT5F9AXjwhg?si=xJ83-DpXhqEue-Rr');
    let formats = ytdl.filterFormats(info.formats,type);
    for(const vFor of formats){
    console.log(vFor.qualityLabel,' ',vFor.mimeType);
    }
}
info();
// ytdl('https://youtu.be/UT5F9AXjwhg?si=xJ83-DpXhqEue-Rr',{filter: 'audioonly'})
//   .pipe(fs.createWriteStream('video.mp4'));