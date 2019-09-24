const RotinaController = require('../controllers/RotinaController');

const responseJSON = function (res) {
	res.json(res);
}

module.exports = function (app) {

	const rotinaController = new RotinaController(app.datasource.models.Rotina);
	const BilheteUnico = app.datasource.models.BilheteUnico;
	const DetalhesRotina = app.datasource.models.DetalhesRotina;


	// Deletar rotina
	app.delete('/usuarios/:user_id/rotinas/:rotina_id', function (req, res) {

		let userID = req.params.user_id;
		let rotinaID = req.params.rotina_id;


		rotinaController.delete(userID, rotinaID, req.body)
			.then(function (response) {
				res.json(response);
			});
	});
	app.post('/usuarios/:user_id/todas', ((req, res) => {

		let userID = req.params.user_id;
		let diasWeekday = {
			domingo: req.body.domingo,
			segunda: req.body.segunda,
			terca: req.body.terca,
			quarta: req.body.quarta,
			quinta: req.body.quinta,
			sexta: req.body.sexta,
			sabado: req.body.sabado
		}

		let bilhete_unico = {
			numero: req.body.numero_bilhete,
			apelido: req.body.apelido_bilhete,
			flag_bilhete_unico: req.body.is_bu,
			tipo_cartao: req.body.tipo_cartao,
			id_usuario: userID, 
			saldo_comum: req.body.saldo_comum,
			saldo_estudante: req.body.saldo_estudante,
			saldo_vt: req.body.saldo_vt,
			cota_diaria_trilho: req.body.cota_diaria_trilho,
			cota_diaria_onibus: req.body.cota_diaria_onibus,
			cota_onibus: req.body.cota_onibus,
			cota_trilho: req.body.cota_trilho
		}

	console.log(bilhete_unico)
	
		rotinaController.createAll(userID, req.body, DetalhesRotina, diasWeekday, BilheteUnico, bilhete_unico)
			.then((response) => {

			console.log(response)

			res.json(response)

			})

	}))



	// Criar rotina
	app.post('/usuarios/:user_id/rotinas', function (req, res) {

		let userID = req.params.user_id;
		let diasWeekday = {
			domingo: req.body.domingo,
			segunda: req.body.segunda,
			terca: req.body.terca,
			quarta: req.body.quarta,
			quinta: req.body.quinta,
			sexta: req.body.sexta,
			sabado: req.body.sabado
		}


		rotinaController.create(userID, req.body, DetalhesRotina, diasWeekday)
			.then(function (response) {
				res.json(response);
			});
	});

	// Atualizar rotina
	app.patch('/usuarios/:user_id/rotinas', function (req, res) {

		let userID = req.params.user_id;

		let diasWeekday = {
			domingo: req.body.domingo,
			segunda: req.body.segunda,
			terca: req.body.terca,
			quarta: req.body.quarta,
			quinta: req.body.quinta,
			sexta: req.body.sexta,
			sabado: req.body.sabado
		}


		rotinaController.update(userID, req.body, DetalhesRotina, diasWeekday)
			.then(function (response) {

				res.json(response);
			});
	});

	app.get('/teste/:usuario_id', function (req, res) {


		let userID = req.params.usuario_id;
		rotinaController.previsao(userID, BilheteUnico)
			.then(function (response) {
				res.json(response);
			});
	});



}
