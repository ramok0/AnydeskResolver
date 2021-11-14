const chalk = require("chalk");
const types = {
    0: {
        text: "OKE",
        color: chalk.greenBright
    },
    1: {
        text: "ERR",
        color: chalk.redBright
    },
    2: {
        text: "INFO",
        color: chalk.blueBright
    }
}

module.exports = (stype, text) => {
    var type = types[stype];
    console.log(`[${type.color(type.text)}] ${type.color(text)}`);
}