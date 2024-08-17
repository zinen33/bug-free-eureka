//thay token dòng 11 70 74
var c=time=>{var date=new Date(`${time}`),y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate(),h=date.getHours(),M=date.getMinutes(),s=date.getSeconds(),fd=`${h<10?'0'+h:h}:${M<10?'0'+M:M}:${s<10?'0'+s:s} || ${d<10?'0'+d:d}/${m<10?'0'+m:m}/${y}`;return fd},_=require,request=_('request'),cheerio=_('cheerio'),axios=_('axios'),fs=_('fs'),turl=_('tinyurl'),k='Không có',kn='không có trong nhóm',ud=undefined,uk='\n┗━━━━━━━━━━━━━━━┛\nVui lòng chọn để xem thêm\n1 Thông tin bài đăng\n2 Các trang đã like\n3 Thành viên gia đình',
getBio=async(uid,api)=>{if(!uid)return'Vui long nhap UID can lay tieu su';var form={av:api.getCurrentUserID(),fb_api_req_friendly_name:'ProfileCometBioTextEditorPrivacyIconQuery',fb_api_caller_class:'RelayModern',doc_id:'5009284572488938',variables:JSON.stringify({'id':uid})},src=await api.httpPost('https://www.facebook.com/api/graphql/', form),bio=(JSON.parse(src)).data?.user?.profile_intro_card;return bio?.bio?bio.bio?.text:k},
getProfileCoverPhoto=async uid=>{console.log(global.cookie);const{data}=await axios('https://www.facebook.com/'+uid,{headers:{cookie:global.cookie}});try{let regex=/<img[^>]*data-imgperflogname='profileCoverPhoto'[^>]*src='([^']+)'/i,matches=data.match(regex);if(matches&&matches.length>1){const src=matches[1];return src}else{return k}}catch(e){return k}}
this.config={name:'info',version:'2.0.0',hasPermsion:0,credits:'Quất',description:'Get info người dùng',usages:'[reply/uid/link/@tag] nếu link có sẵn uid thì tách uid ra bot mới có thể đọc được nhé',commandCategory:'Tìm kiếm',usePrefix:false,cooldowns:0};
this.run=async function({api,event,args,Users,Currencies,permssion:p}) {
let path=__dirname+`/cache/info.png`,token=global.config.ACCESSTOKEN,id,{sendMessage:send}=api
  if (Object.keys(event.mentions).length>0){id=Object.keys(event.mentions)[0]}else id=args[0]!=void 0?(isNaN(args[0])?await api.getUID(args[0]):args[0]):event.senderID;
  if(event.type=='message_reply'){id=event.messageReply.senderID}
  api.sendMessage('🔄 Chờ Bố Ít Phút', event.threadID, event.messageID);   
   try{
   const resp = await axios.get(`https://graph.facebook.com/${id}?fields=id,picture,education,timezone,updated_time,is_verified,cover,created_time,work,hometown,username,name,locale,location,about,website,birthday,gender,relationship_status,significant_other,quotes,subscribers.limit(0)&access_token=EAAD6V7os0gcBOZCoiD4Hsg8IONUZBzfvl8Dr7dCJukIQdwyUku4z2fNQybpsVYR0rEsmkNihRWpuCe3Sh7tezE4QBY4NB5mX4GO1rf4xJy0bL9mBU1u9MmVnX3ZAh5FODSP1XY6dL1d5Tj9UVNw8lCoeN4HcxFDZA4LYgr0my2LJ2NoHV0EZBHZADJKgZDZD`);//console.log(resp.data)
   var {name,updated_time,timezone,link,username,website,is_verified,created_time,birthday,quotes,gender,locale:l,relationship_status,about,location,picture}=resp.data
   var tnu=az=>{return turl.shorten(az)}
   var bio = await getBio(id,api)
   var uid = resp.data.id;
   var rela = resp.data.significant_other?.name;
   var id_rela = resp.data.significant_other?.id;
   var follower = resp.data.subscribers?.summary?.total_count || k;
   var hometown = !!resp.data.hometown?resp.data.hometown?.name:k;
   var cover = resp.data.cover?.source || 'No Cover photo'
   var ban = global.data.userBanned.has(id)==true?'Đang':'Không';
   var money = (await Currencies.getData(id)).money
   var avatar = `https://graph.facebook.com/${id}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`
   var avtlv = `https://graph.facebook.com/${id_rela}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9`
   let u = (await Currencies.getData(id))||k
   var time = require('moment-timezone').tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || DD/MM/YYYY")
   var level=money==ud?kn:p==1?'Quản trị viên':p==2?'Người điều hành bot':p==0?'Thành viên':ud,
   cc=l=='vi_VN'?'Việt Nam':l=='en_US'?'Hoa Kỳ':l=='km_KH'?'Campuchia':l=='lo_LA'?'Lào':l=='en_GB'?'Vương Quốc Anh':k
   var ed=resp.data.education,edc='';if(ed==ud){edc=k}else{for(var i=0;i<ed.length;i++){var edt=ed[i],dc=(await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${edt.type}`)).data[0][0][0],sc=edt.school.name,nm=edt.type;edc+=`, ${sc} (${dc})`}}
   var work=resp.data.work,wk='';if(work==ud){wk=k}else{for(var _=0;_<work.length;_++){var wks=work[_],cv=wks['employer']['name'];wk+=`, ${cv}`}}
   let w=f=>`┗━━━━━━━━━━━━━━━┛\n${f} \n┏━━━━━━━━━━━━━━━┓`
   let cb = async function(s) {
let info = `
┏━━━━━━━━━━━━━━━┓
┃ --- INFO FACEBOOK ---
${w('THÔNG TIN CÁ NHÂN')} 
┣ Tên: ${name}
┣ Xác minh: ${is_verified==true?'Đã':'Chưa'} xác minh
┣ User name: ${username||k}
┣ Uid: ${id}
┣ Giới tính: ${gender=='male'?'Nam':gender=='female'?'Nữ':k}
┣ Giới thiệu: ${about||k}
┣ Quotes: ${quotes||k}
┣ Mối quan hệ: ${relationship_status||k} azaz
┣ Sinh nhật: ${(birthday?(x=>`${x[1]}/${x[0]}/${x[2]}`)(birthday.split('/')) :k).replace('/undefined','')}
┣ Tiểu sử: ${bio||k}
┣ Số follow: ${(follower.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','))||k}
┣ Trường học: ${edc.replace(', ','')}
┣ Công việc: ${wk.replace(', ','')}
${w('THÔNG TIN TRÊN BOT')}
┣ Kiểm tra cấm: ${ban} bị cấm dùng bot
┣ Chức vụ: ${level}
┣ Số tin nhắn: ${u.exp?u['exp']:kn}
┣ Money: ${money?((money.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','))+'$'):kn}
${w('ĐỊA CHỈ')}
┣ Nơi sinh: ${hometown}
┣ Nơi ở: ${!!location?location?.name:k}
┣ Quốc gia: ${cc}
${w('THỜI GIAN')} 
┣ Ở múi giờ số: ${timezone}
┣ Ngày tạo acc: ${c(created_time)}
┣ Cập nhật lần cuối: ${c(updated_time)}
┣ Hiện tại là: ${time}
${w('LIÊN KẾT')} 
┣ Trang web: ${(website||k).replace('https://','')}
┣ Link: Fb.com/${username?username:id}
┣ Link avt: ${(await tnu(avatar)).replace('https://','')}
┣ Link bìa: ${(await tnu(cover)).replace('Error',k).replace('https://','')} zaza`
if(id_rela==ud){api.sendMessage({body:info.replace(/\zaza/g,uk).replace(/\azaz/g,''),attachment:s.filter($=>$!=null)},event.threadID,(e,info)=>{global.client.handleReply.push({name: exports.config.name,messageID: info.messageID,author:id})})}
else{var slv=await axios.get(`https://graph.facebook.com/${id_rela}?fields=id,cover,username&access_token=EAAD6V7os0gcBOZCoiD4Hsg8IONUZBzfvl8Dr7dCJukIQdwyUku4z2fNQybpsVYR0rEsmkNihRWpuCe3Sh7tezE4QBY4NB5mX4GO1rf4xJy0bL9mBU1u9MmVnX3ZAh5FODSP1XY6dL1d5Tj9UVNw8lCoeN4HcxFDZA4LYgr0my2LJ2NoHV0EZBHZADJKgZDZD`);
send({body:info.replace(/\azaz/g,`(${rela})\n┣ Uid: ${id_rela}`).replace(/\zaza/g,`\n┣ Link người set: Fb.com/${slv.data.username||id_rela}\n┣ Link avt set: ${(await tnu(avtlv)).replace('https://','')}\n┣ Link bìa set: ${(await tnu(slv.data.cover?.source)).replace('Error',k).replace('https://','')}`+uk),attachment:s.filter($=>$!=null)},event.threadID,(e,info)=>{global.client.handleReply.push({name:exports.config.name,messageID:info.messageID,author:id})})}}
Promise.all([avatar,cover].map($=>require('axios').get($,{responseType:'stream'}).then(r=>(r.data.path='tmp.jpg',r.data)).catch($=>null))).then(cb)}catch(e){console.log(e);send(e.message,event.threadID,event.messageID)}}
this.handleReply=async function({args,api,event:e,handleReply}){
  let resp=await axios.get(`https://graph.facebook.com/${handleReply.author}?fields=id,likes,family,posts&access_token=EAAD6V7os0gcBOZCoiD4Hsg8IONUZBzfvl8Dr7dCJukIQdwyUku4z2fNQybpsVYR0rEsmkNihRWpuCe3Sh7tezE4QBY4NB5mX4GO1rf4xJy0bL9mBU1u9MmVnX3ZAh5FODSP1XY6dL1d5Tj9UVNw8lCoeN4HcxFDZA4LYgr0my2LJ2NoHV0EZBHZADJKgZDZD`)
  let send=msg=>api.sendMessage(msg,e.threadID,e.messageID)
  let {posts,likes,family}=resp.data,p='',l='',f=''
  switch(e.args[0]){
    case'1':{if(posts==ud){return send('Không có bài đăng nào!!')}else{for(i=0;i<posts.data.length;i++){let{created_time:c_t,message:ms,actions,privacy,shares,status_type:s_t}=posts.data[i],sr=shares==ud?0:shares.count,pv=privacy.description,a_l=(actions[0].link).replace('https://www.facebook.com','fb.com').replace('/posts/','_');p+=`━━━━━━━━━━━━━━━\n${i+1} Tạo lúc: ${c(c_t)}\nTrạng thái: ${pv}\nLượt chia sẻ: ${sr}\nLoại trạng thái: ${s_t.replace(/\_/g,' ')}\n${a_l}\n`}return send(`${p}━━━━━━━━━━━━━━━`)}}
    case'2':{if(likes==ud){return send('Không thích trang nào!!')}else{for(i=0;i<likes.data.length;i++){let{name:n,category:c_g,created_time:c_t,id}=likes.data[i];l+=`━━━━━━━━━━━━━━━\n${i+1} Tên: ${n}\nThể loại: ${c_g}\nLike lúc: ${(c(c_t)).replace('NaN:NaN:NaN || NaN/NaN/NaN','00:00:00 || 00/00/0000')}\nFb.com/${id}\n`}return send(`${l}━━━━━━━━━━━━━━━`)}}
    case'3':{if(family==ud){return send('Không có thành viên nào!!')}else{for(i=0;i<family.data.length;i++){let{name:n,id,relationship:r_s}=family.data[i],rs=(await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${r_s}`)).data[0][0][0];f+=`━━━━━━━━━━━━━━━\n${i+1} Tên: ${n}\nMối quan hệ: ${rs}\nFb.com/${id}\n`}return send(`${f}━━━━━━━━━━━━━━━`)}}
  }
  if(e.args[0]!=1&&e.args[0]!=2&&e.args[0]!=3){return send('Lựa chọn không hợp lệ!!')}
}