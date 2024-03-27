const CColor = require("./ConsoleColors");
lastTime = new Date().getTime();

function log(str)
{
    let d = new Date();
    let msSinceLastLog = "";

    let msDifference = d.getTime() - lastTime;
    lastTime = d.getTime();
    msSinceLastLog = ` (${CColor.FgRed}${msDifference}${CColor.FgCyan})`;

    let time = `${CColor.FgCyan}[${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')} ${String(d.getMilliseconds()).padStart(3, '0')}${msSinceLastLog}]${CColor.Reset}`;
    console.log(time, str);
}

module.exports = log;