const LogController = require('../controllers/LogRotinaController');

module.exports = function(app){

	const logController = new LogController(app.datasource.models.LogRotina);

	// Salvar nova consulta
	app.post('/logs', function(req, res, next){
		logController
			.create(req.body)
			.then(function(response){
				res.json(response);
			});
	});

	app.get('/google', function(req, res){
		return console.log('teste')
	});

	
}