const axios = require('axios');
const { base64ToFile } = require('./utils/base64ToImg');
const { getImageBase64 } = require('./utils/ImageBase64');
const { translateApi } = require('./utils/ItranApi');
const { getSaltImgUrl } = require('./utils/OssImageUrl');
const { Sequelize, Op } = require('sequelize');
const { Asset, IpsAssetClip, IpsTemplate, IpsTemplateClip, IpsAsset64, IpsAsset64Clip } = require('./utils/mysqldefine');
const { onLineAsset, onIpsTmpUnique, onIpsTemplate, onIpsUserTemplateEditAsset, onIpsBanWords, onIpsAssetClip } = require('./utils/mysqlOnline');
const chalk = require('chalk');
const { log } = require('./utils/log');
const fs = require('fs');
const lodash = require('lodash');
const { performance } = require('perf_hooks');
const { wordJson, Repetitive } = require('./option/ips_ban_words');
const { dayjs } = require('./utils/dayjs');

// 全局变量，用于记录已处理的数据的 ID
//每页
let pageSize = 100
//几页
let pageNum = 960  //已经执行到第几页
let startTime  // 获取当前时间作为开始时间

// 执行需要计时的操作...

let endTime  // 获取当前时间作为结束时间


const path = ''; // 本地数据库地址 
const pathOnline = ''; //线上数据库地址
const session_hash = ""  //接口hash值
// 创建 Sequelize 实例并连接到数据库
const sequelize = new Sequelize(path, {
    define: {
        freezeTableName: true
    }
});
const sequelizeOnline = new Sequelize(pathOnline, {
    define: {
        freezeTableName: true
    }
});

async function filterDuplicateWords(sentence) {
    return new Promise((resolve) => {
        let cleanedSentence = sentence;
        for (const item of wordJson) {
            const word = item.word;
            if (word && sentence.includes(word)) {
                cleanedSentence = cleanedSentence.replace(new RegExp(word, 'g'), '');
            }
        }
        resolve(cleanedSentence);
    });
}

// 链接数据库
async function connectMysqlOnLine() {
    try {
        await sequelizeOnline.authenticate();
        console.log('数据库线上连接成功');
    } catch (err) {
        console.error('数据库线上连接失败:', err);
        throw err;
    }
}


// 链接数据库
async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('本地数据库连接成功');
    } catch (err) {
        console.error('本地数据库连接失败:', err);
        throw err;
    }
}

function recordRepeatId(id) {
    fs.appendFileSync('./repeat.txt', `${id}\n`, 'utf8', (err) => {
        if (err) {
            console.error('写入repeat.txt文件时出错：', err);
        }
    });
}


function pageNumFn() {
    const formattedDate = dayjs()
    fs.appendFileSync('./pageNum.txt', `已经完成第${pageNum}批,已经读取${pageNum * pageSize}条数据 ${formattedDate}\n`, 'utf8', (err) => {
        if (err) {
            console.error('写入pageNum.txt文件时出错：', err);
        }
    });
}

async function translateFn(base64Img, id, type) {

    const existingRecord = await onIpsAssetClip.findOne({
        where: {
            id: id
        }
    });

    if (existingRecord) {
        log.success(`id为：${id}的记录已存在数据库中，跳过写入操作`);
        return; // 跳过接下来的操作
    }
    const postData = {
        fn_index: 350,
        data: [0, "", "", base64Img, null, null, null, null],
        session_hash: session_hash
    };
    axios.post('http://portal.stable-diffusion.818ps.com/run/predict/', postData, {
        headers: {
            'Authorization': 'Basic YWkyMDIzOlRnc0BhaSMyMDJJRXM='
        }
    }).then(async response => {
        const prompt = response.data.data[0]
        log.info(`${id}-提示词:${prompt}`);
        if (prompt) {

            const params = {
                text: prompt,
                from: "en",//源语种
                to: "cn"//目标语种
            }

            // 检查数据库中是否已存在该prompt
            const existingClip = await onIpsAssetClip.count({
                where: {
                    sourceText: params.text
                }
            });

            if (existingClip >= 10 || Repetitive.includes(params.text)) {
                recordRepeatId(id)
                log.success(`id为：${id}的 prompt 记录已存在数据库中，跳过写入操作`);
            } else {
                try {

                    // log.info('正在进行翻译----');
                    const result = await translateApi(params)
                    const formattedDate = dayjs()
                    const filteredSentence = await filterDuplicateWords(result.translatedText)
                    log.info(`过滤后文本:[${filteredSentence}]`);
                    const res = await onIpsAssetClip.create({
                        id: id,
                        sourceText: result.sourceText,
                        description: filteredSentence,
                        created: formattedDate
                    });
                    log.success(`id为：${id}-数据库写入成功`);

                } catch (err) {
                    console.log(err, 'errerrerr');
                    log.error(`id为：${id}-数据库写入失败`);
                }

            }
        }
    }).catch(error => {
        console.log(error, 'error');
        log.error(`${id}-提取prompt失败`);
    });

}



async function findPsdAsset() {
    log.success(`----------------------------------即将进行第${pageNum + 1}批,每批${pageSize}条数据---------------------------------`)
    startTime = new Date(); // 获取当前时间作为开始时间
    try {
        const onlineAssets = await IpsAsset64.findAll({
            attributes: ['id', 'sample'], // 仅查询 id 和 sample 字段
            limit: pageSize,
            offset: pageNum * pageSize
        });

        const samples = onlineAssets.map(onlineAsset => {
            return {
                id: onlineAsset.id,
                sample: onlineAsset.sample
            };
        });

        // 处理提取任务
        await processSamples(samples);

    } catch (error) {
        console.log(error, 'error');
    }
}


async function processSamples(samples) {
    console.log('\n'); // 打印一个空行
    console.log('\n'); // 打印一个空行
    log.info('-------------------------------分割线------------------------------')

    if (samples.length === 0) {
        endTime = new Date();
        let elapsedTime = endTime - startTime; // 计算经过的时间差，单位为毫秒
        log.info(`---------------··--本次第${pageNum}批,每批${pageSize}条数据，任务耗时${elapsedTime / 1000}秒················`)// 输出经过的时间差（毫秒）
        console.log('\n'); // 打印一个空行
        console.log('\n'); // 打印一个空行
        console.log('\n'); // 打印一个空行
        console.log('\n'); // 打印一个空行
        console.log('\n'); // 打印一个空行
        pageNum++
        pageNumFn()
        await findPsdAsset();
    }
    const { sample, id } = samples.shift(); // 取出任务列表中的第一个任务
    const imageUrl = getSaltImgUrl(sample);
    log.success(imageUrl);
    try {
        const base64Img = await getImageBase64(imageUrl, id, 0);
        if (base64Img !== '') {
            await translateFn(base64Img, id);

            // 继续执行其他操作
        } else {
            // 处理图片文件大小为0的情况
            // 继续执行其他操作或返回错误
        }
    } catch (error) {
        // 处理其他可能的错误
    }


    // // 等待 5 秒钟
    await new Promise(resolve => setTimeout(resolve, 10000));

    // // 递归调用，处理剩余的任务
    await processSamples(samples);
}



async function mainTeampFn() {
    await connectMysqlOnLine()
    await connectToDatabase()
    await findPsdAsset();
}

mainTeampFn()


