const jwt = require('jwt-simple');
const UsuarioController = require('../controllers/UsuarioController');


module.exports = function (app) {
	const config = app.config;

	const Usuario = app.datasource.models.Usuario;
	const BilheteUnico = app.datasource.models.BilheteUnico;
	const Rotina = app.datasource.models.Rotina;
	const DetalhesRotina = app.datasource.models.DetalhesRotina;

	const usuarioController = new UsuarioController(Usuario);

	//Login padrão
	app.post('/auth', function (req, res) {
		let values = {};
		let usuario = usuarioController.getUser(req.body.email, req.body.senha, BilheteUnico, Rotina, DetalhesRotina)
			.then(function (response) {

				if (response.error == true) {
					res.json(response)
				} else {

					if (response.usuario.bilhete_unico.length <= 0) {
						res.json(response)
					} else {
						let idsRotinas = [];

						let rotinas = response.usuario.rotina

						for (let i = 0; i < rotinas.length; i++) {
							idsRotinas.push(rotinas[i].dataValues.id)
						}

						if (idsRotinas.length <= 0) {
							res.json(response)
						} else {

							let call = usuarioController.getDias(idsRotinas)
								.then(function (aqui) {

									let diasPosicao = aqui.response
									let rotinaJson = response.usuario.rotina
									let ultimaRotina = {}
									let ArrayRotinas = []

									for (let n = 0; n < diasPosicao.length; n++) {
										diasPosicao[n]
										rotinaJson[n]
										ultimaRotina = Object.assign({}, rotinaJson[n].dataValues, diasPosicao[n])
										ArrayRotinas.push(ultimaRotina)

									}

									let BilheteJson = response.usuario.bilhete_unico
									let ArrayBilhetes = []

									for (let m = 0; m < BilheteJson.length; m++) {
										ArrayBilhetes.push(BilheteJson[m].dataValues)
									}

									let usuarioJson = response

									delete usuarioJson['error']
									delete usuarioJson['usuario']['bilhete_unico']
									delete usuarioJson['usuario']['rotina']

									usuarioJson.usuario.bilhete_unico = ArrayBilhetes
									usuarioJson.usuario.rotina = ArrayRotinas

									res.json(usuarioJson)

								});
						}
					}
				}
			});
	});

	// Facebook Login
	app.post('/auth/facebook', app.auth.authenticateFacebook(), function (req, res) {
		let values = {}

		// Tem usuário, então logar
		let usuario = usuarioController.getFacebookOrGoogleUser(req.user, BilheteUnico, Rotina)
			.then(function (response) {

				if (response.error == true) {
					res.json(response)
				} else {

					if (!response.usuario.hasOwnProperty('bilhete_unico')) {
						res.json(response)
						return
					}

					if (response.usuario.bilhete_unico.length <= 0) {
						res.json(response)
					} else {

						if (response.usuario) {
							let id = response.usuario.id;
							response.token = jwt.encode({ id }, config.jwtSecret);
						}

						let idsRotinas = []
						let rotinas = response.usuario.rotina

						for (let i = 0; i < rotinas.length; i++) {
							idsRotinas.push(rotinas[i].dataValues.id)

						}

						if (idsRotinas.length <= 0) {
							res.json(response)
						} else {
							let call = usuarioController.getDias(idsRotinas)
								.then(function (aqui) {


									let diasPosicao = aqui.response
									let rotinaJson = response.usuario.rotina
									let ultimaRotina = {}
									let ArrayRotinas = []

									for (let n = 0; n < diasPosicao.length; n++) {
										diasPosicao[n]
										rotinaJson[n]
										ultimaRotina = Object.assign({}, rotinaJson[n].dataValues, diasPosicao[n])
										ArrayRotinas.push(ultimaRotina)
									}

									let BilheteJson = response.usuario.bilhete_unico
									let ArrayBilhetes = []

									for (let m = 0; m < BilheteJson.length; m++) {
										ArrayBilhetes.push(BilheteJson[m].dataValues)
									}

									let usuarioJson = response
									delete usuarioJson['error']
									delete usuarioJson['usuario']['bilhete_unico']
									delete usuarioJson['usuario']['rotina']

									usuarioJson.usuario.bilhete_unico = ArrayBilhetes
									usuarioJson.usuario.rotina = ArrayRotinas

									res.json(usuarioJson)

								});

						}
					}
				}

			});
	});


	app.post('/getUser', function (req, res) {

		let idsRotinas = req.body
		let routesAll = [];
		let diasSemana =
			['domingo',
				'segunda',
				'terca',
				'quarta',
				'quinta',
				'sexta',
				'sabado'];

		for (let a = 0; a < idsRotinas.length; a++) {
			let rotinaIds = {}

			DetalhesRotina.findAll({ where: { id_rotina: idsRotinas[a] } })
				.then(function (dias) {
					if (!dias) {

					} else {
						for (let l = 0; l < dias.length; l++) {
							// rotinaIds[diasSemana[l]] = dias[l].dataValues.weekday
							if (dias[l].dataValues.weekday != 0) {
								rotinaIds[diasSemana[l]] = true

							} else {
								rotinaIds[diasSemana[l]] = false
							}
						}
						routesAll.push(rotinaIds)
					}
					if (routesAll.length == idsRotinas.length) {
						res.json(routesAll)

					}
				})
		}
	});


	// Google Login
	app.post('/auth/google', app.auth.authenticateGoogle(), function (req, res) {

		let values = {}

		// Tem usuário, então logar
		let usuario = usuarioController.getFacebookOrGoogleUser(req.user, BilheteUnico, Rotina)
			.then(function (response) {

				if (response.error == true) {
					res.json(response)
				} else {

					if (!response.usuario.hasOwnProperty('bilhete_unico')) {
						res.json(response)
						return
					}

					if (response.usuario.bilhete_unico.length <= 0) {
						res.json(response)
					} else {

						if (response.usuario) {
							let id = response.usuario.id;
							response.token = jwt.encode({ id }, config.jwtSecret);
						}

						let idsRotinas = []

						let rotinas = response.usuario.rotina

						for (let i = 0; i < rotinas.length; i++) {
							idsRotinas.push(rotinas[i].dataValues.id)

						}

						if (idsRotinas.length <= 0) {
							res.json(response)
						} else {
							let call = usuarioController.getDias(idsRotinas)
								.then(function (aqui) {


									let diasPosicao = aqui.response
									let rotinaJson = response.usuario.rotina
									let ultimaRotina = {}
									let ArrayRotinas = []

									for (let n = 0; n < diasPosicao.length; n++) {
										diasPosicao[n]
										rotinaJson[n]
										ultimaRotina = Object.assign({}, rotinaJson[n].dataValues, diasPosicao[n])
										ArrayRotinas.push(ultimaRotina)
									}

									let BilheteJson = response.usuario.bilhete_unico
									let ArrayBilhetes = []

									for (let m = 0; m < BilheteJson.length; m++) {
										ArrayBilhetes.push(BilheteJson[m].dataValues)
									}

									let usuarioJson = response
									delete usuarioJson['error']
									delete usuarioJson['usuario']['bilhete_unico']
									delete usuarioJson['usuario']['rotina']
									usuarioJson.usuario.bilhete_unico = ArrayBilhetes
									usuarioJson.usuario.rotina = ArrayRotinas
									res.json(usuarioJson)

								});
						}
					}
				}
			});

	});
}
