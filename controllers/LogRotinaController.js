const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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

class LogRotinaController {
	constructor(Logs) {
		this.Logs = Logs;
	}

	create(logs) {
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

module.exports = LogRotinaController;
