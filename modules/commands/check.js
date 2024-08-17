module.exports.config = {
  name: "فحص",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "DungUwU && Nghĩa",
  description: "فحص التفاعل اليومي/الأسبوعي/الكل",
  commandCategory: "صندوق الدردشة",
  usages: "[all/week/day]",
  cooldowns: 5,
  images: [],
  dependencies: {
    "fs": " ",
    "moment-timezone": " "
  }
};

const path = __dirname + '/tt/';
const moment = require('moment-timezone');

module.exports.onLoad = () => {
  const fs = require('fs');
  if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
    fs.mkdirSync(path, { recursive: true });
  }
  setInterval(() => {
    const today = moment.tz("Asia/Ho_Chi_Minh").day();
    const checkttData = fs.readdirSync(path);
    checkttData.forEach(file => {
      try { 
        var fileData = JSON.parse(fs.readFileSync(path + file)); 
      } catch { 
        return fs.unlinkSync(path + file); 
      }
      if (fileData.time != today) {
        setTimeout(() => {
          fileData = JSON.parse(fs.readFileSync(path + file));
          if (fileData.time != today) {
            fileData.time = today;
            fs.writeFileSync(path + file, JSON.stringify(fileData, null, 4));
          }
        }, 60 * 1000);
      }
    })
  }, 60 * 1000);
}

module.exports.handleEvent = async function({ api, event, Threads }) {
  try {
    if (!event.isGroup) return;
    if (global.client.sending_top == true) return;
    const fs = global.nodemodule['fs'];
    const { threadID, senderID } = event;
    const today = moment.tz("Asia/Ho_Chi_Minh").day();

    if (!fs.existsSync(path + threadID + '.json')) {
      var newObj = {
        total: [],
        week: [],
        day: [],
        time: today,
        last: {
          time: today,
          day: [],
          week: [],
        },
      };
      fs.writeFileSync(path + threadID + '.json', JSON.stringify(newObj, null, 4));
    } else {
      var newObj = JSON.parse(fs.readFileSync(path + threadID + '.json'));
    }
    if (true) {
      const UserIDs = event.participantIDs || [];
      if (UserIDs.length != 0) for (let user of UserIDs) {
        if (!newObj.last) newObj.last = {
          time: today,
          day: [],
          week: [],
        };
        if (!newObj.last.week.find(item => item.id == user)) {
          newObj.last.week.push({
            id: user,
            count: 0
          });
        }
        if (!newObj.last.day.find(item => item.id == user)) {
          newObj.last.day.push({
            id: user,
            count: 0
          });
        }
        if (!newObj.total.find(item => item.id == user)) {
          newObj.total.push({
            id: user,
            count: 0
          });
        }
        if (!newObj.week.find(item => item.id == user)) {
          newObj.week.push({
            id: user,
            count: 0
          });
        }
        if (!newObj.day.find(item => item.id == user)) {
          newObj.day.push({
            id: user,
            count: 0
          });
        }
      }
    }
    fs.writeFileSync(path + threadID + '.json', JSON.stringify(newObj, null, 4));

    const threadData = JSON.parse(fs.readFileSync(path + threadID + '.json'));
    if (threadData.time != today) {
      global.client.sending_top = true;
      setTimeout(() => global.client.sending_top = false, 5 * 60 * 1000);
    }
    const userData_week_index = threadData.week.findIndex(e => e.id == senderID);
    const userData_day_index = threadData.day.findIndex(e => e.id == senderID);
    const userData_total_index = threadData.total.findIndex(e => e.id == senderID);
    if (userData_total_index == -1) {
      threadData.total.push({
        id: senderID,
        count: 1,
      });
    } else threadData.total[userData_total_index].count++;
    if (userData_week_index == -1) {
      threadData.week.push({
        id: senderID,
        count: 1
      });
    } else threadData.week[userData_week_index].count++;
    if (userData_day_index == -1) {
      threadData.day.push({
        id: senderID,
        count: 1
      });
    } else threadData.day[userData_day_index].count++;
    let p = event.participantIDs;
    if (!!p && p.length > 0) {
      p = p.map($ => $ + '');
      ['day', 'week', 'total'].forEach(t => threadData[t] = threadData[t].filter($ => p.includes($.id + '')));
    }
    fs.writeFileSync(path + threadID + '.json', JSON.stringify(threadData, null, 4));
  } catch (e) { }
}

module.exports.run = async function({ api, event, args, Users, Threads }) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const fs = global.nodemodule['fs'];
  const { threadID, messageID, senderID, mentions } = event;
  let path_data = path + threadID + '.json';
  if (!fs.existsSync(path_data)) {
    return api.sendMessage("⚠️ لا توجد بيانات", threadID);
  }
  const threadData = JSON.parse(fs.readFileSync(path_data));
  const query = args[0] ? args[0].toLowerCase() : '';

  if (query == 'box') {
    let body_ = event.args[0].replace(exports.config.name, '') + 'box info';
    let args_ = body_.split(' ');

    arguments[0].args = args_.slice(1);
    arguments[0].event.args = args_;
    arguments[0].event.body = body_;

    return require('./box.js').run(...Object.values(arguments));
  } else if (query == 'reset') {
    let dataThread = (await Threads.getData(threadID)).threadInfo;
    if (!dataThread.adminIDs.some(item => item.id == senderID)) return api.sendMessage('❎ أنت ليس لديك صلاحيات كافية لاستخدام هذا الأمر', event.threadID, event.messageID);
    fs.unlinkSync(path_data);
    return api.sendMessage(`☑️ تم حذف كافة بيانات التفاعل للمجموعة`, event.threadID);
  } else if (query === 'ndfb') {
    let body_ = event.args[0].replace(exports.config.name, '');
    let args_ = body_.split(' ');

    event.args = args_.slice(1);
    event.body = body_;

    return require('./locmemdie.js').run(...Object.values(event));
  } else if (query == 'lọc') {
    let threadInfo = await api.getThreadInfo(threadID);
    if (!threadInfo.adminIDs.some(e => e.id == senderID)) return api.sendMessage("❎ ليس لديك صلاحية استخدام هذا الأمر", threadID);
    if (!threadInfo.isGroup) return api.sendMessage("❎ يمكن استخدام هذا الأمر فقط في المجموعات", threadID);
    if (!threadInfo.adminIDs.some(e => e.id == api.getCurrentUserID())) return api.sendMessage("⚠️ يحتاج البوت إلى صلاحيات المشرف", threadID);
    if (!args[1] || isNaN(args[1])) return api.sendMessage("خطأ", threadID);
    let minCount = +args[1],
        allUser = event.participantIDs;
    let id_rm = [];
    for (let user of allUser) {
      if (user == api.getCurrentUserID()) continue;
      if (!threadData.total.some(e => e.id == user) || threadData.total.find(e => e.id == user).count <= minCount) {
        await new Promise(resolve => setTimeout(async () => {
          await api.removeUserFromGroup(user, threadID);
          id_rm.push(user);
          resolve(true);
        }, 1000));
      }
    }
    return api.sendMessage(`☑️ تم إزالة ${id_rm.length} عضو من المجموعة لعدم وصولهم للعدد المحدد من الرسائل ${minCount}\n\n${id_rm.map(($, i) => `${i + 1}. ${global.data.userName.get($)}`)}`, threadID);
  }

  ////////كود صغير///////////////////////
  var x = threadData.total.sort((a, b) => b.count - a.count);
  var o = [];
  for (i = 0; i < x.length; i++) {
    o.push({
      rank: i + 1,
      id: x[i].id,
      count: x[i].count
    })
  }
  /////////////////////////////////////////////////////////////
  var header = '',
      body = '',
      footer = '',
      msg = '',
      count = 1,
      storage = [],
      data = 0;
    if (query == 'all') {
    header = '📊 قائمة تفاعل الأعضاء:\n\n';
    body = o.map(e => {
      data++;
      return `${data}. ${global.data.userName.get(e.id)}: ${e.count}`;
    }).join('\n');
    footer = `\n\n📅 التاريخ: ${moment.tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD')}`;
    msg = header + body + footer;
  } else if (query == 'week') {
    header = '📅 قائمة تفاعل الأعضاء (الأسبوع):\n\n';
    body = threadData.week.sort((a, b) => b.count - a.count).map(e => {
      data++;
      return `${data}. ${global.data.userName.get(e.id)}: ${e.count}`;
    }).join('\n');
    footer = `\n\n📅 التاريخ: ${moment.tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD')}`;
    msg = header + body + footer;
  } else if (query == 'day') {
    header = '📅 قائمة تفاعل الأعضاء (اليوم):\n\n';
    body = threadData.day.sort((a, b) => b.count - a.count).map(e => {
      data++;
      return `${data}. ${global.data.userName.get(e.id)}: ${e.count}`;
    }).join('\n');
    footer = `\n\n📅 التاريخ: ${moment.tz("Asia/Ho_Chi_Minh").format('YYYY-MM-DD')}`;
    msg = header + body + footer;
  } else {
    return api.sendMessage('⚠️ استخدام غير صحيح. يجب استخدام الأوامر: all, week, day', threadID, messageID);
  }

  return api.sendMessage(msg, threadID, messageID);
};
