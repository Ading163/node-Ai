const axios = require('axios');
const { Buffer } = require('buffer');
const fs = require('fs');
const path = require('path');
const { log } = require('./log');


function recordErrorId(id) {
  fs.appendFileSync('./error.txt', `${id}\n`, 'utf8', (err) => {
    if (err) {
      console.error('写入error.txt文件时出错：', err);
    }
  });
}

async function getImageBase64(url, id, type) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    if (buffer.length === 0) {
      recordErrorId(id);
      log.error('图片文件大小为0，跳过该图片');
      return ''; // 返回空字符串，不抛出错误
    }

    let folderPath
   
    // 将图片保存在本地
    if (type == 0) {
      folderPath = path.join(__dirname, '../素材预览');
    }
    if (type == 1) {
      folderPath = path.join(__dirname, '../模板预览');
    }
    const filePath = path.join(folderPath, `${id}.jpeg`);
    // // 创建目录（如果目录不存在）
    // if (!fs.existsSync(folderPath)) {
    //   fs.mkdirSync(folderPath, { recursive: true });
    // }
    // fs.writeFileSync(filePath, buffer);
    // console.log(`图片保存在: ${filePath}`);
    const base64String = buffer.toString('base64');
    const imageBase64 = `data:image/jpeg;base64,${base64String}`;
    return imageBase64;
  } catch (error) {
    // console.log(error);
    return ''; // 返回空字符串，不抛出错误
  }
}

module.exports = {
  getImageBase64
}