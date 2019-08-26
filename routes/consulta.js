const ConsultaController = require('../controllers/ConsultaController');

module.exports = function(app){

	const consultaController = new ConsultaController(app.datasource.models.ConsultaNfc);

	// Salvar nova consulta
	app.post('/consulta', function(req, res, next){
		consultaController
			.create(req.body)
			.then(function(response){
				res.json(response);
			});
	});

	
}