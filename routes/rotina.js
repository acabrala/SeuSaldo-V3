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

		let userID = req.params.userID;
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
			numero_bilhete: req.body.numero_bilhete,
			apelido_bilhete: req.body.apelido_bilhete,
			is_bu: req.params.is_bus,
			tipo_cartao: req.body.tipo_cartao
		}

		rotinaController.createAll(userID, req.body, DetalhesRotina, diasWeekday, BilheteUnico, bilhete_unico)
			.then((response) => {

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