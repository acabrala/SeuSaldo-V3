const TerminalController = require('../controllers/TerminalController');
const { check, validationResult } = require('express-validator/check');
let envio;

module.exports = function (app) {

    const terminalController = new TerminalController();

    app.post('/terminal', [

        check('nomeOperadora').isLength({ min: 1 }),
        check('imei').isLength({ min: 1 }),
        check('versaoDLL').isLength({ min: 1 }),
        check('versaoAPP').isLength({ min: 1 }).withMessage('Erro, versao APP nulo'),
        check('modeloDispositivo').isLength({ min: 1 }),
        check('idSistemaOperacional').isLength({ min: 1 }),
        check('idAplicacao').isLength({ min: 1 }),
        check('simCardSerialNumber').isLength({ min: 1 }),
        check('modeloComercial').isLength({ min: 1 }),
        check('versaoOS').isLength({ min: 1 }),
        check('gcmID').isLength({ min: 1 })], (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json({ errors: errors.array() });
            }

            let modeloFabricante = req.body.modeloComercial;
            let modeloDispositivo = req.body.modeloDispositivo

            if (modeloFabricante.length < 5 || modeloDispositivo.length < 5) {

                let concatDispositivo = modeloDispositivo.concat(' ' + modeloFabricante)
                let concat = modeloFabricante.concat(' ' + modeloDispositivo)
                envio = {
                    "email": "contato@zazzy.com.br",
                    "senha": "mudar123",
                    "nomeOperadora": req.body.nomeOperadora,
                    "imei": req.body.imei,
                    "versaoDLL": req.body.versaoDLL,
                    "versaoAPP": req.body.versaoAPP,
                    "modeloDispositivo": concatDispositivo,
                    "idSistemaOperacional": req.body.idSistemaOperacional,
                    "idAplicacao": req.body.idAplicacao,
                    "serialTerminal": req.body.imei,
                    "simCardSerialNumber": req.body.simCardSerialNumber,
                    "modeloComercial": concat,
                    "versaoOS": req.body.versaoOS,
                    "gcmID": req.body.gcmID
                }

            } else {

                envio = {
                    "email": "contato@zazzy.com.br",
                    "senha": "mudar123",
                    "nomeOperadora": req.body.nomeOperadora,
                    "imei": req.body.imei,
                    "versaoDLL": req.body.versaoDLL,
                    "versaoAPP": req.body.versaoAPP,
                    "modeloDispositivo": req.body.modeloDispositivo,
                    "idSistemaOperacional": req.body.idSistemaOperacional,
                    "idAplicacao": req.body.idAplicacao,
                    "serialTerminal": req.body.imei,
                    "simCardSerialNumber": req.body.simCardSerialNumber,
                    "modeloComercial": req.body.modeloComercial,
                    "versaoOS": req.body.versaoOS,
                    "gcmID": req.body.gcmID
                }
            }

            let response = terminalController.callProcess(envio);
            let rpcSet = response.data.checksum;

            let json = {
                "checksum": rpcSet
            }

            let juncao = Object.assign(json, envio)
            let rpc = terminalController.callRPC(JSON.stringify(juncao))
                .then(function (resposta) {
                    res.json(resposta)
                });
        })

    app.post('/cartao/vem', ((req, res) => {

        let numeroCartao = req.body.numeroCartao
        let token = req.body.token
        let numeroTerminal = req.body.numeroTerminal

        terminalController.callRpcVem(token, numeroCartao, numeroTerminal)
            .then((response) => {
                res.json(response)
            })
    }));

    app.post('/cartao/bem', ((req, res) => {

        let numeroCartao = req.body.numeroCartao
        let token = req.body.token
        let numeroTerminal = req.body.numeroTerminal

        terminalController.callRpcBem(token, numeroCartao, numeroTerminal)
            .then((response) => {
                res.json(response)
            })



    }))

    app.post('/cartao', function (req, res) {
        let numeroCartao = req.body.numeroCartao;
        let token = req.body.token;
        let numeroTerminal = req.body.numeroTerminal;

        let response = terminalController.callRpcCartao(token, numeroCartao, numeroTerminal)
            .then(function (resposta) {
                res.json(resposta)
            });

    });

    app.post('/carteiras', function (req, res) {
        let modeloFabricante = req.body.modeloComercial;
        let modeloDispositivo = req.body.modeloDispositivo
        let idSistemaOperacional = req.body.idSistemaOperacional

        if (idSistemaOperacional == 1) {
            if (modeloFabricante.length < 5 || modeloDispositivo.length < 5) {

                let concatDispositivo = modeloDispositivo.concat(' ' + modeloFabricante)
                let concat = modeloFabricante.concat(' ' + modeloDispositivo)
                envio = {
                    "email": "contato@zazzy.com.br",
                    "senha": "mudar123",
                    "nomeOperadora": req.body.nomeOperadora,
                    "imei": req.body.imei,
                    "versaoDLL": req.body.versaoDLL,
                    "versaoAPP": req.body.versaoAPP,
                    "modeloDispositivo": concatDispositivo,
                    "idSistemaOperacional": req.body.idSistemaOperacional,
                    "idAplicacao": req.body.idAplicacao,
                    "serialTerminal": req.body.imei,
                    "simCardSerialNumber": req.body.simCardSerialNumber,
                    "modeloComercial": concat,
                    "versaoOS": req.body.versaoOS,
                    "gcmID": req.body.gcmID
                }


            } else {

                envio = {
                    "email": "contato@zazzy.com.br",
                    "senha": "mudar123",
                    "nomeOperadora": req.body.nomeOperadora,
                    "imei": req.body.imei,
                    "versaoDLL": req.body.versaoDLL,
                    "versaoAPP": req.body.versaoAPP,
                    "modeloDispositivo": req.body.modeloDispositivo,
                    "idSistemaOperacional": req.body.idSistemaOperacional,
                    "idAplicacao": req.body.idAplicacao,
                    "serialTerminal": req.body.imei,
                    "simCardSerialNumber": req.body.simCardSerialNumber,
                    "modeloComercial": req.body.modeloComercial,
                    "versaoOS": req.body.versaoOS,
                    "gcmID": req.body.gcmID
                }
            }
        } else {
            envio = {
                "email": "contato@zazzy.com.br",
                "senha": "mudar123",
                "nomeOperadora": req.body.nomeOperadora,
                "imei": "89550532110900977",
                "versaoDLL": req.body.versaoDLL,
                "versaoAPP": req.body.versaoAPP,
                "modeloDispositivo": req.body.modeloDispositivo,
                "idSistemaOperacional": req.body.idSistemaOperacional,
                "idAplicacao": req.body.idAplicacao,
                "serialTerminal": "1as1as1as1as",
                "simCardSerialNumber": "89550532110010900977",
                "modeloComercial": req.body.modeloComercial,
                "versaoOS": req.body.versaoOS,
                "gcmID": req.body.gcmID
            }
        }

        let response = terminalController.callProcess(envio);
        let rpcSet = response.data.checksum;
        let json = {
            "checksum": rpcSet
        }

        let juncao = Object.assign(json, envio)
        let rpc = terminalController.callRPC(JSON.stringify(juncao))
            .then(function (resposta) {

                res.json(resposta)
            });
    });

    app.post('/carteiras/disponivel', function (req, res) {

        let numeroCartao = req.body.numeroCartao;
        let token = req.body.token;
        let numeroTerminal = req.body.numeroTerminal;
        let response = terminalController.callRpcCarteiras(token, numeroCartao, numeroTerminal)
            .then(function (resposta) {
                res.json(resposta)
            });
    });
}