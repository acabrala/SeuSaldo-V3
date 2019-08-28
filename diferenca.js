const moment = require('moment');

let variavel = "01/01/2018 10:01:01"
let hora = moment().format("DD/MM/YYYY HH:mm:ss");


let dataRotina = moment("25/10/2018 8:01:01", 'DD/MM/YYYY HH:mm:ss');
let dataAtual = moment(hora, "DD/MM/YYYY HH:mm:ss");
let minutesDiff = dataAtual.diff(dataRotina, 'minutes');
