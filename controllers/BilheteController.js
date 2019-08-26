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

class BilheteController{
	constructor(Bilhete){
		this.Bilhete = Bilhete;
	}


	create(bilhete, modalComum){
		return this.Bilhete.create(bilhete)
			.then(function(bilhete){


				var response = {
					error: false,
					message: "Bilhete cadastrado com sucesso!",
					id: bilhete.dataValues
								};

				return response;
				//return successResponse('Bilhete Unico adicionado com sucesso.');
			}).catch(function(err){
				return errorResponse(err.message);
			});
	}

	update(userID, bilheteID, bilhete){

		if(bilhete.saldo_comum == 'null'){
			bilhete.saldo_comum = null
			console.log(bilhete.saldo_comum)

		}
		if(bilhete.saldo_estudante == 'null'){
			bilhete.saldo_estudante = null
		}
		if(bilhete.saldo_vt == 'null'){
			bilhete.saldo_vt = null
			console.log(bilhete.saldo_vt)
		}

		if(bilhete.cota_onibus == 'null'){
			bilhete.cota_onibus = null
		}

		if(bilhete.cota_trilho == 'null'){
			bilhete.cota_trilho = null
		}

		if(bilhete.cota_diaria_onibus == 'null'){
			bilhete.cota_diaria_onibus = null
		}

		if(bilhete.cota_diaria_trilho == 'null'){
			bilhete.cota_diaria_trilho = null
		}

		return this.Bilhete.update(bilhete, {
			where: {
				[Op.and]: [{id: bilheteID}, {id_usuario: userID}]
			}
		}).then(function(bilhete){
			return successResponse('Bilhete Único atualizado com sucesso.');
		}).catch(function(err){
			return errorResponse(err.message);
		});			
	}

	getBilhete(bilheteID){

		return this.Bilhete.findOne({where: {id :bilheteID}})
				.then(function(bilhete){
					if(bilhete){
						return bilhete.saldo
					}
				});
	}

	deleteBilhete(userID,bilheteID){
		return this.Bilhete.destroy({
			where: {
				[Op.and]: [{id: bilheteID}, {id_usuario: userID}]
			}
		}).then(function(rotina){

			return successResponse('Bilhete exluído com sucesso.');
		}).catch(function(err){
			return errorResponse("Erro ao excluir seu bilhete. Erro: " + err.message);
		});
	}
}

module.exports = BilheteController;
