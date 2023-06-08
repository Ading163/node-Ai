/**
 * 机器翻译 WebAPI 接口调用示例
 * 运行前：请先填写Appid、APIKey、APISecret
 * 运行方法：直接运行 main() 即可 
 * 结果： 控制台输出结果信息
 * 
 * 1.接口文档（必看）：https://www.xfyun.cn/doc/nlp/xftrans/API.html
 * 2.错误码链接：https://www.xfyun.cn/document/error-code （错误码code为5位数字）
 * @author iflytek
 */
const CryptoJS = require('crypto-js')
const { itransConfig } = require('../config/itrans')
const axios = require('axios');
const { log } = require('./log');


// 系统配置
const config = itransConfig

// 生成请求body
function getPostBody(text, from, to) {
    let digestObj = {
        //填充common
        common: {
            app_id: config.appid
        },
        //填充business
        business: {
            from: from,
            to: to
        },
        //填充data
        data: {
            text: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text))
        }
    }
    return digestObj
}

// 请求获取请求体签名
function getDigest(body) {
    return 'SHA-256=' + CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(JSON.stringify(body)))
}


// 鉴权签名
function getAuthStr(date, digest) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nPOST ${config.uri} HTTP/1.1\ndigest: ${digest}`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line digest", signature="${signature}"`
    return authorizationOrigin
}


async function translateApi(transVar) {
    const date = new Date().toUTCString()
    const postBody = getPostBody(transVar.text, transVar.from, transVar.to)
    const digest = getDigest(postBody)
    const params = {
        url: config.hostUrl,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json,version=1.0',
            'Host': config.host,
            'Date': date,
            'Digest': digest,
            'Authorization': getAuthStr(date, digest)
        },
        json: true,
        body: postBody
    }

    try {
        const response = await axios.post(params.url, params.body, { headers: params.headers });
        const body = response.data;

        if (body.code !== 0) {
            log.error(`发生错误，错误码：${body.code}，错误原因：${body.message}`);
            return { error: true, message: `发生错误，错误码：${body.code}，错误原因：${body.message}` };
        } else {
            log.info(`sid：${body.sid}`);
            log.info(`原文：[${body.data.result.from}] ${body.data.result.trans_result.src}`);
            log.info(`译文：[${body.data.result.to}] ${body.data.result.trans_result.dst}`);
            return {
                sid: body.sid,
                from: body.data.result.from,
                sourceText: body.data.result.trans_result.src,
                to: body.data.result.to,
                translatedText: body.data.result.trans_result.dst
              };
        }
    } catch (error) {
        log.error('error', error);
        return { error: true, message: error.message };
    }
}

module.exports = {
    translateApi
}