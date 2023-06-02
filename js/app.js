const inputElem = document.querySelector('input');

// DB
let addreses = [
    { isp: 'IRC - MBT 1', ip: 'cdn.hostpro.tech' },
    { isp: 'IRC - MBT 2', ip: 'cdn2.hostpro.tech' },
    { isp: 'IRC - MBT 3', ip: 'cdn3.hostpro.tech' }
]

let blackList = [
    new RegExp(/\w+\.nazsuk.ga/g),
    new RegExp(/\w+\.hostpro.tech/g),
    new RegExp(/\w+\.p-rayan.cloud/g)
]

let whiteList = [
    'mentally-retarded.tk',
    'yoozmobile.tech'
]
// DB

// comp
const makeid = (length) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// comp

// cfg logic
let userConfig;
const getConfigObj = () => {
    let userLink = inputElem.value.trim();
    let isLinkValid = userLink.includes('vmess://');
    if (isLinkValid) {
        userLink = userLink.match(/vmess:\/\/\S+/g)[0];
        userConfig = JSON.parse(atob(userLink.slice(8)));
        initConfig();
    } else {
        renderBtn('لینک وارد شده صحیح نمیباشد', 'bg-red-400')
    }
}

const initConfig = () => {
    userConfig.net === 'grpc' ? checkGRPCConfig()
        : userConfig.net === 'ws' ? checkWSConfig()
            : '';
}

const checkGRPCConfig = () => {

    let isSNIBlack = false;
    if (userConfig.sni) {
        for (let regex of blackList) {
            isSNIBlack = regex.test(userConfig.sni);
            if (isSNIBlack) break
        }
        isSNIBlack ? renderBtn('به پشتیبانی مراجعه کنید', 'bg-red-400') : fixConfig();
        console.log(isSNIBlack);
    } else {
        console.log(isSNIBlack);
        fixConfig() 
    }
}

const checkWSConfig = () => {
    if (userConfig.sni) {
        let isSNIBlack = false;
        for (let regex of blackList) {
            isSNIBlack = regex.test(userConfig.sni);
            if (isSNIBlack) break
        }
        if (isSNIBlack) {
            renderBtn('به پشتیبانی مراجعه کنید', 'bg-red-400');
            userConfig = ''
        } else {
            userConfig = { ...userConfig, port: '', host: '' }
            userConfig.port = 8443
            userConfig.host = ''
            userConfig.net = 'grpc'
            fixConfig();
        }
    } else { fixConfig() }
}

let fixedConfigsTxt = ''
let fixedConfigs = []
const fixConfig = () => {
    fixedConfigs = [];
    addreses.forEach(adds => {
        let tempObj = { ...userConfig, sni: '' };
        tempObj.add = adds.ip
        tempObj.ps = `YoozNetwork [${adds.isp}]`
        tempObj.path = ''
        tempObj.sni = `${makeid(8)}.${whiteList[random(0, whiteList.length - 1)]}`
        fixedConfigs.push(tempObj)
        tempObj = ''
    });


    console.log(fixedConfigs);
    fixedConfigsTxt = ''
    fixedConfigs.forEach(cfg => {
        fixedConfigsTxt += `vmess://${btoa(JSON.stringify(cfg))}\n\n`
    })


    navigator.clipboard.writeText(fixedConfigsTxt)
        .then(() => {
            renderBtn('کانفیگ ها در کلیپ بورد ذخیره شدند', 'bg-green-500');
        })
        .catch((err) => console.log(err))

    
}
// cfg logic

// DOM
const btn = document.querySelector('.btn-primary');
const renderBtn = (msg, colorClass) => {
    btn.innerHTML = msg
    btn.className = `btn-primary ${colorClass}`
}
btn.addEventListener('click', getConfigObj)
// DOM
