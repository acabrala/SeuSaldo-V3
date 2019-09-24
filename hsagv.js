const moment = require("moment-timezone")

console.log(moment().tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss"));
