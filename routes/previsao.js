const PrevisaoController = require('../controllers/PrevisaoController');


module.exports = function(app){

	const previsaoController = new PrevisaoController(app.datasource.models.BilheteUnico);
	const Rotina = app.datasource.models.Rotina;
	const DetalhesRotina = app.datasource.models.DetalhesRotina;

	app.get('/previsao/:usuario_id/:bilhete_id', function(req,res){
		
		let userID = req.params.usuario_id;
		let bilheteID = req.params.bilhete_id

		previsaoController.calcularPrevisao(userID, Rotina, bilheteID, DetalhesRotina)
			.then(function(response){
				res.json(response);
			});

		});

}
