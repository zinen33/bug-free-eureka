let urls = require('./../../Data_Vtuan/datajson/cos.json');// mày nếu k thích cos thì thay = cái khác
const axios = require("axios");
const fs = require("fs");
class Command {
    constructor(config) {
        this.config = config;
        this.queues = [];
    };
    async onLoad(o) {
        let status = false;
        if (!global.client.dzvcl) global.client.dzvcl = setInterval(_ => {
            if (status == true || this.queues.length > 50) return;// check hàng chờ 50 vd trên 1slot/1slot
            status = true;
            Promise.all([...Array(10)].map(e => upload(urls[Math.floor(Math.random() * urls.length)]))).then(res => (this.queues.push(...res), status = false));
        }, 1000 * 5);// check hàng chờ 10 vd trên 1 slot
        async function streamURL(url, type) {
            return axios.get(url, {
                responseType: 'arraybuffer'
            }).then(res => {
                const path = __dirname + `/cache/${Date.now()}.${type}`;
                fs.writeFileSync(path, res.data);
                setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
                return fs.createReadStream(path);
            });
        }
        async function upload(url) {
            return o.api.postFormData('https://upload.facebook.com/ajax/mercury/upload.php', {
                upload_1024: await streamURL(url, 'mp4')
            }).then(res => Object.entries(JSON.parse(res.body.replace('for (;;);', '')).payload?.metadata?.[0] || {})[0]);
        };
    }
    async run(o) {
        let send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));
        send({
            body: `con mẹ mày béo`,
            attachment: this.queues.splice(0, 1)
        });
    }
}
module.exports = new Command({
    name: "cos",// mày có thể thay bẳng trai gái vv....
    version: "0.0.1",
    hasPermssion: 0,
    credits: "DC-Nam",
    description: "",
    commandCategory: "Tiện ích",
    usages: "[]",
    cooldowns: 0,
});// mày nếu k thích cos thì thay = cái khác