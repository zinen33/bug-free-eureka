const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
this.config = {
 name: "sing",
 version: "1.2.9",
 hasPermssion: 0,
 credits: "DongDev",// Thay credits làm chó
 description: "Nghe nhạc từ nền tảng YouTube",
 commandCategory: "Tiện ích",
 usages: "sing + keyword",
 cooldowns: 5,
 images: [],
};
async function search(keyWord) {
  try {
     const res = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(keyWord)}`);
     const getJson = JSON.parse(res.data.split("ytInitialData = ")[1].split(";</script>")[0]);
     const videos = getJson.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
     const results = [];
     for (const video of videos)
     if (video.videoRenderer?.lengthText?.simpleText)
         results.push({
          id: video.videoRenderer.videoId,
              title: video.videoRenderer.title.runs[0].text,
          thumbnail: video.videoRenderer.thumbnail.thumbnails.pop().url,
          time: video.videoRenderer.lengthText.simpleText,
          channel: {
               id: video.videoRenderer.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
               name: video.videoRenderer.ownerText.runs[0].text,
               thumbnail: video.videoRenderer.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer.thumbnail.thumbnails.pop().url.replace(/s[0-9]+\-c/g, '-c')
            }
          });
    return results;
     } catch (e) {
    const error = new Error("Cannot search video");
    error.code = "SEARCH_VIDEO_ERROR";
    throw error;
    }
}
async function getData(id) {
  id = sanitizeYouTubeId(id);
  if (!id) throw new Error('Missing data to start the program');
  try {
    const formats = await getFormatsUrl(id);
    return formats;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
function sanitizeYouTubeId(id) {
  const match = id.match(/(?:vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)([^#&?]*).*/);
  return match ? match[1] : id;
}
async function getFormatsUrl(id) {
  const url = `https://www.youtube.com/watch?v=${id}`;
  async function convert(videoId, k) {
  try {
    const formData = new URLSearchParams();
    formData.append('vid', videoId);
    formData.append('k', k);
    const res = await axios.post("https://9convert.com/api/ajaxConvert/convert", formData.toString());
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}
  const formData = new URLSearchParams();
  formData.append('query', url);
  formData.append('vt', 'home');
  const response = await axios.post("https://9convert.com/api/ajaxSearch/index", formData.toString());
  const { vid: videoId, links } = response.data;
  const linksArray = Object.values(links).flatMap(Object.values);
  const conversionPromises = linksArray.map(link => convert(videoId, link.k).then(result => Object.assign(link, result)));
  await Promise.all(conversionPromises);
  const res = links.m4a["140"];
  return {
    id: res.vid,
    title: res.title,
    url: res.dlink,
    };
};
async function getStreamAndSize(url, path = "") {
    const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
        headers: {
            'Range': 'bytes=0-'
        }
    });
    if (path)
        response.data.path = path;
    const totalLength = response.headers["content-length"];
    return {
        stream: response.data,
        size: totalLength
    };
}
const MAX_SIZE = 27262976;
this.run = async function ({ args, event, api }) {
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    if (args.length === 0 || !args) {
        return send("🐧 → 𝑲𝒉𝒐̂𝒏𝒈 𝒃𝒊𝒆̂́𝒕 𝒔𝒂̀𝒊 𝒕𝒉𝒊̀ 𝒃𝒊𝒆̂́𝒏");
    }
    const keywordSearch = args.join(" ");
    const path = `${__dirname}/cache/${event.senderID}.mp3`;
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
    try {
        let keyWord = keywordSearch.includes("?feature=share") ? keywordSearch.replace("?feature=share", "") : keywordSearch;
        const maxResults = 5;
        let result = await search(keyWord);
        result = result.slice(0, maxResults);
        if (result.length === 0) {
            return send(`𝐌𝐚̀𝐲 𝐭𝐢̀𝐦 𝐜𝐚́𝐢 𝐜𝐚́𝐢 𝐠𝐢̀ 𝐯𝐚̣̂𝐲 𝐤𝐮 🐸`);
        }
        let msgg = "";
        let i = 1;
        const arrayID = [];
        for (const info of result) {
            arrayID.push(info.id);
            msgg += `${i++} → ${info.title}\nTime: ${info.time}\n\n`;
        }
       send({ body: `${msgg}→ 𝐯𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐛𝐚̣𝐧 𝐨𝐥𝐝𝐞𝐫 𝐛𝐚̀𝐢 đ𝐞̂̉ 𝐛𝐨𝐭 𝐩𝐡𝐚́𝐭 𝐧𝐡𝐚̣𝐜 𝐜𝐡𝐨 𝐛𝐚̣𝐧` }, (err, info) => {
          if (err) {
             return send(`❎ Đã xảy ra lỗi: ${err.message}`);
          }
          global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                arrayID,
                result,
                path
             });
         });
      } catch (err) {
        send(`❎ Đã xảy ra lỗi: ${err.message}`);
    }
};
this.handleReply = async function ({ api, event, handleReply: _ }) {
    const send = (msg, callback) => api.sendMessage(msg, event.threadID, callback, event.messageID);
    try {
        const startTime = Date.now();
        let data = _.result[event.body - 1];
        send(`𝐯𝐮𝐢 𝐥𝐨̀𝐧𝐠 𝐜𝐡𝐨̛̀ 𝐜𝐡𝐮́𝐭 𝐝𝐞̂̉ 𝐥𝐚̂́𝐲 𝐥𝐢𝐧𝐤....`, async (erro, infom) => {
        let { title, id, url, timestart } = await getData(data.id);
        const savePath = _.path || `${__dirname}/cache/${event.senderID}.mp3`;               
        const getStream = await getStreamAndSize(url, `${id}.mp3`);
        if (getStream.size > MAX_SIZE) {
            api.unsendMessage(infom.messageID);
            return send(`❎ 𝐯𝐮̛𝐨̛̣𝐭 𝐪𝐮𝐚́ 𝟐𝟓𝐦𝐛 𝐫𝐨̂̀𝐢 𝐜𝐦𝐦 𝐛𝐞𝐨`);
        }     
        const writeStream = fs.createWriteStream(savePath);
        getStream.stream.pipe(writeStream);
        const contentLength = getStream.size;
        let downloaded = 0;
        let count = 0;
        api.unsendMessage(_.messageID);
        getStream.stream.on("data", (chunk) => {
            downloaded += chunk.length;
            count++;
            if (count == 5) {
                const endTime = Date.now();
                const speed = downloaded / (endTime - startTime) * 1000;
                const timeLeft = (contentLength / downloaded * (endTime - startTime)) / 1000;
                const percent = downloaded / contentLength * 100;
                if (timeLeft > 30) send(`𝙫𝙪𝙞 𝙡𝙤̀𝙣𝙜 𝙘𝙝𝙤̛̀ 𝙘𝙝𝙪́𝙩...`)
            }
        });
        writeStream.on("finish", () => {
            send({
                body: `🎬 Tiêu đề: ${title}\n👤 Tên kênh: ${data.channel.name}\n⏱️ Thời lượng: ${data.time}\n⏳ Tốc độ xử lý: ${Math.floor((Date.now() - startTime) / 1000)} giây`,
                attachment: fs.createReadStream(savePath)
            }, async (err) => {
                if (err)
                    return send(`❎ Đã xảy ra lỗi: ${err.message}`);
                fs.unlinkSync(savePath);
               });
           });
            api.unsendMessage(infom.messageID);
       });
    } catch (error) {
        send(`❎ Đã xảy ra lỗi: ${error.message}`);
    }
};