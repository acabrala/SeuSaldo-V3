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

		var userID = req.params.user_id;
		var rotinaID = req.params.rotina_id;

		console.log(rotinaID)

		rotinaController.delete(userID, rotinaID, req.body)
			.then(function (response) {
				res.json(response);
			});
	});

	// Criar rotina
	app.post('/usuarios/:user_id/rotinas', function (req, res) {

		var userID = req.params.user_id;
		let diasWeekday = {domingo : req.body.domingo,
			segunda : req.body.segunda,
			terca : req.body.terca,
			quarta : req.body.quarta,
			quinta : req.body.quinta,
			sexta : req.body.sexta,
			sabado : req.body.sabado}

		rotinaController.create(userID, req.body, DetalhesRotina, diasWeekday)
			.then(function (response) {
				res.json(response);
			});
	});

	// Atualizar rotina
	app.patch('/usuarios/:user_id/rotinas', function (req, res) {

		var userID = req.params.user_id;

		let diasWeekday = { domingo : req.body.domingo,
			segunda : req.body.segunda,
			terca : req.body.terca,
			quarta : req.body.quarta,
			quinta : req.body.quinta,
			sexta : req.body.sexta,
			sabado : req.body.sabado }

			console.log(diasWeekday);
			



		rotinaController.update(userID, req.body, DetalhesRotina, diasWeekday)
			.then(function (response) {

				res.json(response);
			});
		});

	app.get('/teste/:usuario_id', function (req, res) {


		var userID = req.params.usuario_id;
		rotinaController.previsao(userID, BilheteUnico)
			.then(function (response) {
				res.json(response);
			});
	});

	

}