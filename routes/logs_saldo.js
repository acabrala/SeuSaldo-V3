const LogsSaldoController = require('../controllers/LogsSaldoController');

module.exports = function(app){

	const logsSaldoController = new LogsSaldoController(app.datasource.models.LogsSaldo);

	// Salvar nova consulta
	app.post('/logs/saldo', function(req, res, next){
		logsSaldoController
			.create(req.body)
			.then(function(response){
				res.json(response);
			});
	});

	
}