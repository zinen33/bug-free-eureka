const axios = require("axios");
const fs = require("fs");

const isURL = (u) => /^http(|s):\/\//.test(u);

exports.handleEvent = async function (o) {
  try {
    const str = o.event.body;
    const send = (msg) =>
      o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
    const head = (app) =>
      `==『 AUTODOWN ${app.toUpperCase()} 』==\n────────────────`;
    // const head = app => '';
    if (isURL(str)) {
      if (/fb|facebook/.test(str)) {
        //const data = await fbVideo(str);
        const res = await axios.get(`https://hoanghao.me/api/facebook/download?url=${str}`);
        send({
          body: `${head('FaceBook')}\nTiêu Đề : ${res.data.data.title}`, attachment: await streamURL(res.data.data.video, 'mp4')
        });
      }
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO TIKTOK */ 
       else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
                const json = await infoPostTT(str);
                let attachment = [];
                if (json.images != undefined) {
                    for (const $ of json.images) {
                        attachment.push(await streamURL($, 'png'));
                    }
                } else {
                    attachment = await streamURL(json.play, 'mp4');
                }
          o.api.sendMessage({body: `${head('TIKTOK')}
•👤 𝐓𝐞̂𝐧 𝐊𝐞̂𝐧𝐡: ${json.author.nickname}
•😽 𝐈𝐃 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐝𝐮̀𝐧𝐠: ${json.author.unique_id}
•🌐 𝐐𝐮𝐨̂́𝐜 𝐠𝐢𝐚: ${json.region}
•💬 𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${json.title}
•❤️ 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗶𝗺: ${json.digg_count}
•👁‍🗨 𝐋𝐮̛𝐨̛̣𝐭 𝐱𝐞𝐦: ${json.play_count}
•💭 𝐋𝐮̛𝐨̛̣𝐭 𝗯𝗶̀𝗻𝗵 𝗹𝘂𝗮̣̂𝗻: ${json.comment_count}
•🔗 𝗟𝘂̛𝗼̛̣𝘁 𝗰𝗵𝗶𝗮 𝘀𝗲̉: ${json.share_count}
•⏰ Thời gian: ${json.duration}s
•📥 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗮̉𝗶: ${json.download_count}
•𝗧𝗵𝗮̉ 💢 𝗻𝗲̂́𝘂 𝗺𝘂𝗼̂́𝗻 𝘁𝗮̉𝗶 𝗻𝗵𝗮̣𝗰`, attachment },o.event.threadID,(error, info) => {
    global.client.handleReaction.push({
      name: this.config.name, 
      messageID: info.messageID,
      author: o.event.senderID,
      data: json
          })
                },o.event.messageID);
                    } 
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO YOUTUBE */ 
      else if (/(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//.test(str)) {
                let ytdl = require('ytdl-core');

               ytdl.getInfo(str).then(async info => {
                    let detail = info.videoDetails;
                    let format = info.formats.find(f => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate);
                    if (format) {
                         send({
                              body: `${head('YOUTUBER')}\n- Tiêu Đề: ${detail.title}`,
                              attachment: await streamURL(format.url, 'mp4')
                         });
                    } else {
                         console.error('Không tìm thấy định dạng phù hợp!');
                    }
            }) 
                    }
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO IBB */ 
    /*  else if (/ibb\.co/.test(str)) {
         send({body: `${head('IMGBB')}\n`,attachment: await streamURL(str, str.split('.').pop()) })
              } */
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO IMGUR */ 
    /*  else if (/imgur\.com/.test(str)) {
                send({body: `${head('IMGUR')}\n`,
                    attachment: await streamURL(str, str.split('.').pop())
                })
            } */
      /*AUTODOWN CAPCUT VIIDEO */
      else if (/capcut\.com/.test(str)) {
                var res = (await axios.get(`https://api.phungtuanhai.online/capcut/download?apikey=PTH&url=${str}`))
                  send({body: `${head('CAPCUT')}\n→ Tiêu Đề: ${res.data.title}\n→ Description : ${res.data.description}\n→ Lượt Xem : ${res.data.usage}\n`,attachment: await streamURL(res.data.videoUrl, 'mp4')})
                }
      /* TỰ ĐỘNG TẢI ẢNH, VIDEO, AUDIO CỦA FILE CATBOX*/ 
   /*   else if(/catbox\.moe/.test(str)){
      send({body: `${head('FILE-CATBOX')}\n`,attachment: await streamURL(str, str.split('.').pop()) })
  } */
      /* TỰ ĐỘNG TẢI ẢNH HOẶC NHẠC SOUNDCLOUD */ 
      else if(/soundcloud\.com/.test(str)){
        send({body: `${head("SOUNDCLOUD")}`,attachment: await streamURL(`https://api.phungtuanhai.online/soundcloud/download?link=${str}&apikey=PTH`, 'mp3')})
                  }
        /* TỰ ĐỘNG TẢI ẢNH HOẶC NHẠC SPOTIFY */ 
      else if(/spotify\.com/.test(str)){
        const url = (await axios.get(`https://api.phungtuanhai.online/spotify/download?apikey=PTH&link=${str}`)).data.audio
        send({body: `${head("SPOTIFY")}`,attachment: await streamURL(url, 'mp3')})
      }
      /* TỰ ĐỘNG TẢI NHẠC ZINGMP3 */ 
      else if(/zingmp3\.vn/.test(str)){
          send({body: `${head('ZINGMP3')}\n`,attachment: await streamURL(`https://api.phungtuanhai.online/zingmp3/download?apikey=PTH&link=${str}`, 'mp3')})
        }
      /* TỰ ĐỘNG TẢI ẢNH, VIDEO TWITTER */ 
      else if (/twitter\.com/.test(str)) {
      const res = (await axios.get(`https://api.phungtuanhai.online/twitter/download?url=${str}&apikey=PTH`)).data
      let attachment = [];
                      if (res.data.video_url != null) {
      attachment = await streamURL(res.data.video_url[1].url,"mp4")
      } else {
      attachment = await streamURL(res.data.media_url[0], 'jpg');
                      }
      send({body: `${head("TWITTER")}\n→ Tiêu đề: ${res.data.text}`,attachment})
      }
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO PINTEREST */ 
      else if (/(^https:\/\/)((www)\.)?(pinterest|pin)*\.(com|it)\//.test(str)) {
                const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${str}`);
                send({
                    body: `${head('PINTEREST')}\n- link: ${res.data.data.image.url}`, attachment: await streamURL(res.data.data.image.url, 'jpg')});
            } 
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO INSTAGRAM */ 
      else if (/instagram\.com/.test(str)) {
                const res = await axios.get(`https://api.phungtuanhai.online/instagram/dlpost?apikey=PTH&url=${str}`);
                const {
                    videos = [{}],
                    images
                } = res.data;
                let attachment = [];

                if (videos[0] != undefined) {
                    attachment = await streamURL(videos[0], 'mp4');
                } else if (images != undefined) {
                    for (const $ of typeof images == 'string' ? [images]: images) {
                        attachment.push(await streamURL($, 'png'));
                    }
                }
                send({
                    body: `${head('INSTAGRAM')}\n→ Tiêu Đề: ${res.data.caption}`, attachment
                });
            }
        }

    } catch(e) {
        console.log('Error', e);
    }
};
exports.run = () => {};
exports.handleReaction = async function (o){
  const { threadID: t, messageID: m, reaction: r } = o.event
  const { handleReaction: _ } = o
  if (r != "💢") return; 
  o.api.sendMessage({ body: `
  ====『 MUSIC TIKTOK 』====
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱
👤 𝐈𝐃: ${_.data.music_info.id}
💬 𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${_.data.music_info.title}
🔗 𝐋𝐢𝐧𝐤: ${_.data.music_info.play}
⏱️ 𝐓𝐡𝐨̛̀𝐢 𝐠𝐢𝐚𝐧: ${_.data.music_info.duration}
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱`,attachment: await streamURL(_.data.music, "mp3")},t,m)
}
exports.config = {
    name: 'autodow',
    version: '1',
    hasPermssion: 0,
    credits: 'Công Nam mod all Harin',
    description: '',
    commandCategory: 'Tiện ích',
    usages: [],
    cooldowns: 3
};

function streamURL(url, type) {
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then(res => {
        const path = __dirname + `/cache/${Date.now()}.${type}`;
        fs.writeFileSync(path, res.data);
        setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
        return fs.createReadStream(path);
    });
}

function infoPostTT(url) {
    return axios({
        method: 'post',
        url: `https://tikwm.com/api/`,
        data: {
            url
        },
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.data.data);
  }