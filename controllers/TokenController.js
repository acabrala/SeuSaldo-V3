const tokenGenerator = require('tokgen');
const moment = require('moment')
const momenTz = require('moment-timezone')

const errorResponse = function (message) {
	return {
		error: true,
		message: message
	}
}

const successResponse = function (message) {
	return {
		error: false,
		message: message
	}
}

class TokenController {
	constructor(Token) {
		this.Token = Token;
	}

	create(token, id_usuario, email, id_mobile, id_so) {
		return this.Logs.create(logs)
			.then(function (logs) {
				let response = {
					error: false,
					message: "Operação realizado com sucesso!"
				};

				return response;
			}).catch(function (err) {
				return errorResponse(err.message);
			});
	}

}

module.exports = TokenController;
