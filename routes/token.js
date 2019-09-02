const TokenController = require('../controllers/TokenController');

module.exports = function(app){

	const tokenController = new TokenController(app.datasource.models.Token);

	// Criar novo bilhete
	app.post('/token/:id_usuario/:email/:id_mobile/:id_so', function(req, res, next){

        let id_usuario = req.params.id_usuario;
        let email = req.params.email;
        let id_mobile = req.params.id_mobile;
        let id_so = req.params.id_so;

		tokenController.create(req.body, id_usuario, email, id_mobile, id_so)
			.then(function(response){
				res.json(response);
			});
	});


	app.post('/validar/:token_email/:id_usuario', (req, res) => {

		let token_email = req.params.token_email;
		let id_usuario = req.params.id_usuario

		tokenController.ativarToken(req.body, token_email, id_usuario)
			.then(response => {
				res.json(response)
			})
	})
}