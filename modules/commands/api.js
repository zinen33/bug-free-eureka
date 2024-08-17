const fs = require('fs');
const path = require('path');

const pathApi = path.join(__dirname, '../../Data_Vtuan/datajson/');
// địt cụ mày
module.exports.config = {
  name: "api",// bố m thêm cái lệnh này có sài dc hay 0 thì bố mày kbt bố m chỉ bt nó add vào api m chọn thôi ok
  version: "1.0.0",
  hasPermssion: 3,
  credits: "Vtuan",
  description: "no",
  commandCategory: "Admin",
  usages: "[list,add,del,create,share]",
  cooldowns: 1
};

function countLinesSync(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r\n|\r|\n/);
  return lines.length;
}

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length > 0) {
      if (args[0].toLowerCase() === 'list') {
        const files = fs.readdirSync(pathApi);
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

        if (jsonFiles.length > 0) {
          const fileListArray = jsonFiles.map((file, index) => ({
            index: index + 1,
            fileName: path.basename(file, '.json'),
            filePath: path.join(pathApi, file),
            lineCount: countLinesSync(path.join(pathApi, file)),
          }));

          const fileList = fileListArray.map(item => `${item.index}. ${item.fileName} (${item.lineCount} lines)`).join('\n');

          const messageInfo = await api.sendMessage(`Danh sách:\n${fileList}`, event.threadID);

          const replyInfo = {
            name: module.exports.config.name,
            messageID: messageInfo.messageID,
            author: event.senderID,
            fileListArray,
            type: 'list'
          };
          global.client.handleReply.push(replyInfo);

          return;
        } else {
          return api.sendMessage(`Thư mục rỗng`, event.threadID);
        }
      } else if (args[0].toLowerCase() === 'add') {
        let msg = '';
        const replyMessage = event.messageReply;

        let fileName = 'test.json';

        if (args.length > 1) {
          fileName = args.slice(1).join('_') + '.json';
        }
        const filePath = path.join(pathApi, fileName);

        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '[]', 'utf-8');
        }

        for (let i of replyMessage.attachments) {
          await require("axios")
            .get(
              `https://hoanghao.me/api/tinyurlupload?url=${encodeURIComponent(i.url)}`
            )
            .then(async ($) => {
              msg += `${$.data.url}\n`;
            });
        }

        let existingData = [];

        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          existingData = JSON.parse(fileContent);
        } catch (error) {
          console.error('Error reading JSON file:', error);
        }

        existingData = existingData.concat(msg.split('\n').filter(Boolean));

        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf-8');

        return api.sendMessage(msg, event.threadID);
      } else if (args[0].toLowerCase() === 'create') {
        let fileName = 'test.json';

        if (args.length > 1) {
          fileName = args.slice(1).join('_') + '.json';
        }
        const filePath = path.join(pathApi, fileName);

        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '[]', 'utf-8');
          return api.sendMessage(`Đã tạo file ${fileName}.json`, event.threadID);
        } else {
          return api.sendMessage(`File ${fileName}.json đã tồn tại`, event.threadID);
        }
      } else if (args[0].toLowerCase() === 'del') {
        let fileName = 'test.json';

        if (args.length > 1) {
          fileName = args.slice(1).join('_') + '.json';
        }
        const filePath = path.join(pathApi, fileName);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return api.sendMessage(`Đã xóa file ${fileName}`, event.threadID);
        } else {
          return api.sendMessage(`File ${fileName}.json không tồn tại`, event.threadID);
        }
      } else if (args[0].toLowerCase() === 'share' && args.length > 1) {
        const fileName = args[1].toLowerCase() + '.json';
        const filePath = path.join(__dirname, '../../Data_Vtuan/datajson/', fileName);

        try {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const txtFilePath = path.join(__dirname, '../../Data_Vtuan/datajson/', `${fileName}.txt`);
          fs.writeFileSync(txtFilePath, fileContent, 'utf-8');
          const messageInfo = await api.sendMessage({ attachment: fs.createReadStream(txtFilePath) }, event.threadID);
          fs.unlinkSync(txtFilePath);

          return;
        } catch (error) {
          console.error('Error reading or sending file:', error);
          return api.sendMessage('Đã xảy ra lỗi trong quá trình xử lý!', event.threadID);
        }
      }
    }

    const files = fs.readdirSync(pathApi);
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
    const tong = jsonFiles.length;
    let tsdong = 0;
    for (const file of jsonFiles) {
      const filePath = path.join(pathApi, file);
      tsdong += countLinesSync(filePath);
    }

    const cachsudung = "\n> list: all api\n> add: add video/mp3 vào data\n> del: xoá file json\n> create: tạo file json\n>share: share file json";

    return api.sendMessage(`=>Tổng số file api hiện có: ${tong}\n=>Tổng số dòng: ${tsdong}\n=>Cách dùng: ${cachsudung}`, event.threadID, async (error, info) => {
      if (error) {
        console.error(error);
      } else {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: 'api'
        });
      }
    });

  } catch (error) {
    console.error('Error in run function:', error);
    return api.sendMessage('Đã xảy ra lỗi trong quá trình xử lý!', event.threadID);
  }
};

module.exports.handleReply = async ({ api, handleReply, event, pathApi }) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const { threadID, senderID, body, messageID } = event;
    const { fileListArray, messageID: replyMessageID, type } = handleReply;

    const args = body.split(' ');
    let messages = [];

    if (type === 'list') {
      if (args[0].toLowerCase() === 'del') {
        // Xử lý lệnh del ở đây
        const fileIndices = args.slice(1).map(index => parseInt(index));

        for (const fileIndex of fileIndices) {
          if (fileIndex >= 1 && fileIndex <= fileListArray.length) {
            const selectedFile = fileListArray[fileIndex - 1];
            const filerm = path.join(__dirname, '../../Data_Vtuan/datajson/', `${selectedFile.fileName}.json`);
            messages.push(`Đã xóa file ${selectedFile.fileName}`);

            fs.unlink(filerm, (err) => {
              if (err) {
                console.error(`Error deleting file ${filerm}:`, err);
              }
            });
          } else {
            messages.push(`Index ${fileIndex} không hợp lệ`);
          }
        }

        api.sendMessage(messages.join('\n'), threadID);
      } else if (args[0].toLowerCase() === 'create') {
        const pathApi = path.join(__dirname, '../../Data_Vtuan/datajson/');
        let fileName = 'vdgai.json';

        if (args.length > 1) {
          fileName = args.slice(1).join('_') + '.json';
        }

        const filePath = path.join(pathApi, fileName);

        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '[]', 'utf-8');
          api.sendMessage(`Đã tạo file ${fileName}`, threadID);
        } else {
          api.sendMessage(`File ${fileName} đã tồn tại`, threadID);
        }
      }
    } else if (type === 'api' && args[0].toLowerCase() === 'create') {
      const pathApi = path.join(__dirname, '../../Data_Vtuan/datajson/');
      let fileName = 'test.json';

      if (args.length > 1) {
        fileName = args.slice(1).join('_') + '.json';
      }

      const filePath = path.join(pathApi, fileName);

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf-8');
        api.sendMessage(`Đã tạo file ${fileName}`, threadID);
      } else {
        api.sendMessage(`File ${fileName} đã tồn tại`, threadID);
      }
    }
  } catch (error) {
    console.error('Lỗi trong hàm handleReply:', error);
  }
};