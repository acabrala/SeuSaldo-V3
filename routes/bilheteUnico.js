
const BilheteController = require('../controllers/BilheteController');
const util = require('util');
module.exports = function(app){

	const bilheteController = new BilheteController(app.datasource.models.BilheteUnico);

	// Criar novo bilhete
	app.post('/bilhete', function(req, res, next){
		 bilheteController
			.create(req.body)
			.then(function(response){
				res.json(response)
			});
	});


	// Atualizar bilhete
	app.patch('/usuarios/:user_id/bilhetes/:bilhete_id', function(req, res){
		let userID = req.params.user_id;
		let bilheteID = req.params.bilhete_id;
		console.log('*********************')
		console.log(req.body)

		bilheteController
			.update(userID, bilheteID, req.body)
			.then(function(response){
				res.json(response);
			});
	});

	app.get('/bilhete/saldo/:bilhete_id', function(req, res){

		let bilheteID = req.params.bilhete_id;

		bilheteController
			.getBilhete(bilheteID)
			.then(function(response){
				res.json(response);
			});
	});

	app.delete('/bilhete/excluir/:user_id/:bilhete_id', function(req, res){

		let bilheteID = req.params.bilhete_id
		let userID = req.params.user_id

		bilheteController
			.deleteBilhete(userID, bilheteID)
			.then(function(response){
				res.json(response);
			});
	});
}