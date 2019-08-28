const UsuarioController = require('../controllers/UsuarioController');
const moment = require('moment');


module.exports = function (app) {

	const usuarioController = new UsuarioController(app.datasource.models.Usuario);

	app.post('/register', function (req, res) {

		usuarioController
			.create(req.body)
			.then(function (response) {
				res.json(response);
			});
	});

	// Atualizar usuário
	app.patch('/usuarios/:user_id', function (req, res) {

		var userID = req.params.user_id;

		usuarioController
			.update(userID, req.body)
			.then(function (response) {
				res.json(response);
			});
	});

	app.put('/usuarios/senha', function (req, res) {

		let email = req.body.email;

		usuarioController.resetUserPassword(email)
			.then(function (response) {
				res.json(response);
			});
	});

	app.post('/usuarios/codigo', function (req, res) {
		let email = req.body.email;
		let code = req.body.code;

		usuarioController.verifyUserCode(email, code)
			.then(function (response) {
				res.json(response);
			});
	});

	app.post('/usuarios/reset', function (req, res) {

		let email = req.body.email
		let token = req.body.passwordToken;
		let password = req.body.newPassword

		usuarioController.changeUserPassword(email, password, token)
			.then(function (response) {
				res.json(response)
			});
	});
}
