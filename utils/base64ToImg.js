const fs = require('fs');

function base64ToFile(base64Data, fileName) {

    // 移除Base64数据开头的"data:image/png;base64,"部分
    const base64WithoutPrefix = base64Data.replace(/^data:image\/\w+;base64,/, '');

    // 将Base64数据解码为二进制数据
    const fileData = Buffer.from(base64WithoutPrefix, 'base64');

    // 将二进制数据写入文件
    fs.writeFile(fileName, fileData, (error) => {
        if (error) {
            console.error('An error occurred while writing the file:', error);
        } else {
            console.log('File saved successfully:', fileName);
        }
    });
}

module.exports = {
    base64ToFile
}
