const chalk = require('chalk');

const log = {
    success: (message) => console.log(chalk.rgb(67, 161, 6)(`${message}`)),
    error: (message) => console.log(chalk.rgb(231, 52, 82)(`${message}`)),
    info: (message) => console.log(chalk.rgb(255, 205, 31)(`${message}`)),
}

module.exports = {
    log
}