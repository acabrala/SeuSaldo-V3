const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const errorResponse = function(message){
	return {
		error: true,
		message: message
	}
}

const successResponse = function(message){
	return {
		error: false,
		message: message
	}
}

class ConsultaController{
	constructor(Consulta){
		this.Consulta = Consulta;
	}

	create(consulta){
		return this.Consulta.create(consulta)
			.then(function(consulta){
				let response = {
					error: false,
					message: "Consulta realizada com sucesso!"
				};

				return response;
				//return successResponse('Bilhete Unico adicionado com sucesso.');
			}).catch(function(err){
				return errorResponse(err.message);
			});
	}

}

module.exports = ConsultaController;