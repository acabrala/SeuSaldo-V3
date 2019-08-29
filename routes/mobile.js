const MobileController = require('../controllers/MobileController');

module.exports = function(app){

	const mobileController = new MobileController(app.datasource.models.Mobile);

	// Criar novo bilhete
	app.post('/mobile', function(req, res, next){

		mobileController.create(req.body)
			.then(function(response){
				res.json(response);
			});
	});
}