module.exports.config = {
    name: "zimoh",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "DRIDI-RAYEN",
    description: "",
    commandCategory: "〘 الخدمات 〙",
    usePrefix: false,
    cooldowns: 5,
};

module.exports.run = function ({ api, event }) {
    api.sendMessage(
        "بوت",
        event.threadID,
        (err, info) => {
            setTimeout(() => api.editMessage(info.messageID, "الاسطوري"), 3000);
            setTimeout(() => api.editMessage(info.messageID, "لونا"), 6000);
            setTimeout(() => api.editMessage(info.messageID, "من تطوير"), 9000);
           setTimeout(() => api.editMessage(info.messageID, "زينو و محمد"), 12000);
        },
        event.messageID
    );
};

/*
module.exports = {
  config: {
    name: "الأوامر",
    alias: ["اوامر", "الاوامر", "أوامر"],
  },
  onChat: async ({ message , api }) => {
    const fs = require("fs");
    message.reply(
      {
        body : menux,
        attachment: fs.createReadStream(__dirname+"/cache/tmp/menu.jpg")
      }
    , (err, info)=> {
      setTimeout(
        ()=> {
        api.editMessage(info.messageID, change)
      }, 15000)
    });
  },
};


const menux = `〄 الأوامــــر الرئيســية 🤍⤷

  ⌁ : قرآن ←› سور قرآنية 
  ⌁ : احزر ←› لعبة اسلامية 
  ⌁ : عربي ←› جمع او مفرد 
  ⌁ : عواصم ←› لعبة عواصم الدول 
  ⌁ : اعلام ←› لعبة اعلام الدول 
  ⌁ : كت ←› لعبة كت تويت 
⌁ : ارسم ←› رسم بالذكاء اصطناعي 
  ⌁ : تخيل ←› رسم بالذكاء اصطناعي 
  ⌁ : موديلز ←› موديلات امر التخيل 
  ⌁ : حزورة ←› لعبة الثقافة العامة 
  ⌁ : رقم ←› لعبة الحظ بارقام 
  ⌁ : تخمين ←› لعبة الحظ بارقام 
  ⌁ : كلمات ←› لعبة كتابة الكلمات 
  ⌁ : ترتيب ←› لعبة ترتيب الكلمات 
  ⌁ : روكبيبر ←› لعبة حجرة ورقة مقص 
  ⌁ : الكل ←› امر التاغ الجماعي 
  ⌁ : ترقية ←› رفع جودة الصورة  
  ⌁ : ازالة ←› ازالة خلفية الصورة 
  ⌁ : انمي ←› تحويل الصورة الى انمي 
  ⌁ : زومبي ←› وجه زومبي على الصورة
  ⌁ : المكتبة ←› مكتبة الانميات و افلام الانمي

  ⌯︙ايدي -› ايدي تعريفي لحسابك . 
  ⌯︙التوب -› افضل عشر متفاعلين .
  ⌯︙دخول -› شات برق (الدعم) .

⌔︙{ كتابة } ← m.me/3amarx

﴿ إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا﴾
  ..
  `

const change = `﴿ إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا﴾`
*/