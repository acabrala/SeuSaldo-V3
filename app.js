const express = require('express');
const config = require('./config/config');
const facebookConfig = require('./config/facebook-auth-config');
const googleConfig = require('./config/google-auth-config');
const datasource = require('./config/datasource');
const bodyParser = require('body-parser');
const authorization = require('./auth');

/* importa rotas */
const usuarioRouter = require('./routes/usuario');
const authRouter = require('./routes/auth');
const bilheteRouter = require('./routes/bilheteUnico');
const rotinaRouter = require('./routes/rotina');
const mobileRouter = require('./routes/mobile');
const consultaRouter = require('./routes/consulta');
const terminalRouter = require('./routes/terminal');
const logRouter = require('./routes/log_rotina');
const previsaoRouter = require('./routes/previsao');
const localizacaoRouter = require('./routes/localizacao')
const viagemExtraRouter = require('./routes/viagemExtra');
const logsSaldoRouter = require('./routes/logs_saldo');
const consumoGraficoRouter = require('./routes/consumoGrafico');
const interesseRouter = require('./routes/interesse');

const app = express();
app.config = config;
app.configFacebookAuth = facebookConfig;
app.configGoogleAuth = googleConfig;
app.datasource = datasource(app);
app.set('port', 3000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const auth = authorization(app);
app.use(auth.initialize());
app.auth = auth;

usuarioRouter(app);
authRouter(app);
bilheteRouter(app);
rotinaRouter(app);
mobileRouter(app);
consultaRouter(app);
terminalRouter(app);
logRouter(app);
previsaoRouter(app);
localizacaoRouter(app)
viagemExtraRouter(app);
logsSaldoRouter(app)
consumoGraficoRouter(app)
interesseRouter(app)

module.exports = app;