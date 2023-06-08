const crypto = require('crypto');
const path = require('path');
const url = require('url');
const querystring = require('querystring');


/**
 * 获取图片预览图
 * @param {*} imgPath 接收数据库preview图片预览地址 例如：/ips_templ_preview/1b/da/d7/lg_5830115_1683690375_645b1387c5cd3.jpg
 * @param {*} isEncode 
 * @param {*} scheme 
 * @param {*} expireTime 
 * @param {*} newExpirationTimeComputeMode 
 * @returns 有效的在线预览地址
 */
function getSaltImgUrl(imgPath, isEncode = true, scheme = false, expireTime = 259200, newExpirationTimeComputeMode = 0) {
  if (!imgPath) {
    return '';
  }

  //  将生成的图片地址转为 webp 格式
  //   imgPath = imageToWebp(imgPath);
  imgPath = '/' + imgPath.replace(/^\//, '');

  const settingExpireTime = 1800; // 系统默认时间，鉴权 URL 实际有效时长=timestamp+CDN 配置的鉴权 URL 有效时长
  let nowTime;
  const now = Math.floor(Date.now() / 1000);
  if (newExpirationTimeComputeMode === 1) {
    nowTime = now + expireTime;
  } else {
    nowTime = now - (now % expireTime) + expireTime - settingExpireTime;
  }

  const pathParts = path.parse(imgPath);
  const basenameParts = pathParts.base.split('!');
  basenameParts[0] = isEncode ? encodeURIComponent(basenameParts[0]) : basenameParts[0];
  const basename = basenameParts.length > 1 ? `${basenameParts[0]}!${basenameParts[1]}` : basenameParts[0];

  const authKey = `${nowTime}-0-0-${crypto.createHash('md5').update(`${pathParts.dir}/${basename}-${nowTime}-0-0-${'2ds14d9fdg4df32'}`).digest('hex')}`;
  const query = querystring.stringify({ auth_key: authKey });

  const imageUrl = url.format({
    protocol: scheme ? 'https:' : undefined,
    hostname: '//img1.tuguaishou.com',
    pathname: imgPath,
    search: query,
  });
  return imageUrl;
}


module.exports = {
  getSaltImgUrl
}