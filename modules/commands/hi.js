module.exports.config = {
  name: "مرحبا",
  version: "1.0.0",
  hasPermssion: 0,
  credit: " :)",
  description: "ارسال ملصق",
  commandCategory: "المدير",
  usages: "[نص]",
  cooldowns: 0
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  let KEY = ["مرحبا",
    "اهلا",
    "هلا",
    "مرحبا",
    "سلام",
    "هاي",
    "مرحبا",
    "مرحبًا",
    "السلام عليكم",
    "سلام عليكم",
    "السلام",
    "اهلا وسهلا"];
  let thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["hi"] == "undefined", thread["hi"] == false) return
  else {
  if (event.body && KEY.includes(event.body.toLowerCase()) !== false) {
    let data = [
      "526214684778630",
      "526220108111421",
      "526220308111401",
      "526220484778050",
      "526220691444696",
      "526220814778017",
      "526220978111334",
      "526221104777988",
      "526221318111300",
      "526221564777942",
      "526221711444594",
      "526221971444568",
     "2041011389459668", "2041011569459650", "2041011726126301", "2041011836126290", "2041011952792945", "2041012109459596", "2041012262792914", "2041012406126233", "2041012539459553", "2041012692792871", "2041014432792697", "2041014739459333", "2041015016125972", "2041015182792622", "2041015329459274", "2041015422792598", "2041015576125916", "2041017422792398", "2041020049458802", "2041020599458747", "2041021119458695", "2041021609458646", "2041022029458604", "2041022286125245"
    ];
    let sticker = data[Math.floor(Math.random() * data.length)];
    let moment = require("moment-timezone");
    let hours = moment.tz('Asia/Ho_Chi_Minh').format('HHmm');
    let data2 = [
      "جيدة",
      "سعيدة"
    ];
    let text = data2[Math.floor(Math.random() * data2.length)]
    let session = (
    hours > 0001 && hours <= 400 ? "فجر" : 
    hours > 401 && hours <= 700 ? "صباح مبكر" :
    hours > 701 && hours <= 1000 ? "صباح" :
    hours > 1001 && hours <= 1200 ? "ظهر" : 
    hours > 1201 && hours <= 1700 ? "عصر" : 
    hours > 1701 && hours <= 1800 ? "مساء" : 
    hours > 1801 && hours <= 2100 ? "مساء" : 
    hours > 2101 && hours <= 2400 ? "ليل" : 
    "خطأ");
    let name = await Users.getNameUser(event.senderID);
    let mentions = [];
    mentions.push({
      tag: name,
      id: event.senderID
    })
    let msg = {body: `┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤💬 مرحبا ${name}\n┣➤💓 نتمنى لك ${session} ${text}\n┣➤🥰 مع محبة ${name}\n┣➤⏰ الآن الساعة : ${moment().tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY")}\n┗━━━━━━━━━━━━━━━━━━━━┛`, mentions}
    api.sendMessage( msg , event.threadID, (e, info) => {
      setTimeout(() => {
        api.sendMessage({sticker: sticker}, event.threadID);
      }, 100)
    }, event.messageID)
  }
      }
}

module.exports.languages = {
  "ar": {
    "on": "تشغيل",
    "off": "إيقاف",
    "successText": `${this.config.name} بنجاح`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
}

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
  else data["hi"] = true;
  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
}
