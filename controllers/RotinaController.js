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


class RotinaController {
	constructor(Rotina) {
		this.Rotina = Rotina;
	}

	delete(userID, rotinaID, rotina) {
		return this.Rotina.destroy({
			where: {
				[Op.and]: [{ id: rotinaID }, { usuario_id: userID }]
			}
		}).then(function (rotina) {
			return successResponse('Suas rotinas foram excluídas.');
		}).catch(function (error) {
			return errorResponse("Erro ao tentar excluir suas rotinas. Erro: " + err.message);
		});
	}

	create(userID, rotina, Detalhesrotina, diasWeekday) {
		rotina.usuario_id = userID;
		let diasRotinaUsuario = [];

		return this.Rotina.create(rotina)
		.then(function (rotina) {

			let response = {
				error: false,
				message: "Rotinas inseridas com sucesso!",
				id: rotina.dataValues.id
			};

			if (diasWeekday.domingo == 1) {
				diasRotinaUsuario.push(7)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.segunda == 1) {
				diasRotinaUsuario.push(1)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.terca == 1) {
				diasRotinaUsuario.push(2)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.quarta == 1) {
				diasRotinaUsuario.push(3)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.quinta == 1) {
				diasRotinaUsuario.push(4)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.sexta == 1) {
				diasRotinaUsuario.push(5)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.sabado == 1) {
				diasRotinaUsuario.push(6)
			} else {
				diasRotinaUsuario.push(0)
			}

			for (let i = 0; i <= diasRotinaUsuario.length - 1; i++) {

				let payload = {
					weekday: diasRotinaUsuario[i],
					id_rotina: rotina.dataValues.id,
					id_bilhete: rotina.id_bilhete
				}

				Detalhesrotina.create(payload).then(results => {
				});
			}

			return response;
		}).catch(function (err) {
			return errorResponse("Erro ao inserir suas rotinas. Erro: " + err.message);
		});
	}

	async createAll(userID, rotina, Detalhesrotina, diasWeekday, BilheteUnico, bilhete) {
		
		let _this = this;
		let idaVolta = rotina.volta;
		let diasRotinaUsuario = [];
		let ids = []
		let response;
		let bu = await BilheteUnico.create(bilhete)
		if (bu) {


			rotina.horario = rotina.hora_ida
			rotina.usuario_id = userID;
			rotina.id_bilhete = bu.dataValues.id
			return this.Rotina.create(rotina)
			.then(function (rotinaIda) {

				ids.push(rotinaIda.dataValues.id)

				if (diasWeekday.domingo == 1) {
					diasRotinaUsuario.push(7)
				} else {
					diasRotinaUsuario.push(0)
				}
				if (diasWeekday.segunda == 1) {
					diasRotinaUsuario.push(1)
				} else {
					diasRotinaUsuario.push(0)
				}
				if (diasWeekday.terca == 1) {
					diasRotinaUsuario.push(2)
				} else {
					diasRotinaUsuario.push(0)
				}
				if (diasWeekday.quarta == 1) {
					diasRotinaUsuario.push(3)
				} else {
					diasRotinaUsuario.push(0)
				}
				if (diasWeekday.quinta == 1) {
					diasRotinaUsuario.push(4)
				} else {
					diasRotinaUsuario.push(0)
				}
				if (diasWeekday.sexta == 1) {
					diasRotinaUsuario.push(5)
				} else {
					diasRotinaUsuario.push(0)
				}
				if (diasWeekday.sabado == 1) {
					diasRotinaUsuario.push(6)
				} else {
					diasRotinaUsuario.push(0)
				}

				for (let i = 0; i <= diasRotinaUsuario.length - 1; i++) {

					let payload = {
						weekday: diasRotinaUsuario[i],
						id_rotina: rotinaIda.dataValues.id,
						id_bilhete: rotinaIda.id_bilhete
					}

					Detalhesrotina.create(payload)
				}

				if(rotina.volta == true) {

					const rotinaVolta = _this.createVolta(rotina)
					.then(rotinaVolta => {
						
						ids.push(rotinaVolta.id)

						for (let i = 0; i <= diasRotinaUsuario.length - 1; i++) {
							let payload = {
								weekday: diasRotinaUsuario[i],
								id_rotina: rotinaVolta.id,
								id_bilhete: rotinaVolta.id_bilhete
							}

							Detalhesrotina.create(payload)

						}	
						return response = {
							error: false,
							message: "Rotinas inseridas com sucesso!",
							id_rotina: ids,
							id_bilhete: rotinaVolta.id_bilhete
						};		


					})

					return rotinaVolta
				} else {

					return response = {
						error: false,
						message: "Rotinas inseridas com sucesso!",
						id_rotina: [rotinaIda.dataValues.id],
						id_bilhete: rotinaIda.dataValues.id_bilhete
					};

				}


			}).catch(function (err) {
				return errorResponse("Erro ao inserir suas rotinas. Erro: " + err.message);
			});

		} else {
			return errorResponse("Não conseguimos salvar seu bilhete único, tente novamente mais tarde.")
		}
	}

	update(userID, rotina, Detalhesrotina, diasWeekday) {

		let rotinaID = rotina.id;
		let diasRotinaUsuario = [];
		let idsDetalhesArray = []


		return this.Rotina.update(rotina, {
			where: {
				[Op.and]: [{ id: rotina.id }, { usuario_id: userID }]
			}
		}).then(function (rotina) {

			if (diasWeekday.domingo == true) {
				diasRotinaUsuario.push(7)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.segunda == true) {
				diasRotinaUsuario.push(1)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.terca == true) {
				diasRotinaUsuario.push(2)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.quarta == true) {
				diasRotinaUsuario.push(3)
			} else {
				diasRotinaUsuario.push(0)

			}
			if (diasWeekday.quinta == true) {
				diasRotinaUsuario.push(4)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.sexta == true) {
				diasRotinaUsuario.push(5)
			} else {
				diasRotinaUsuario.push(0)
			}
			if (diasWeekday.sabado == true) {
				diasRotinaUsuario.push(6)
			} else {
				diasRotinaUsuario.push(0)
			}

			Detalhesrotina.findAll({
				where: {
					id_rotina: rotinaID
				}
			}).then(function (idDetalhes) {
				for (let z = 0; z < idDetalhes.length; z++) {
					idsDetalhesArray.push(idDetalhes[z].dataValues.id)
					idsDetalhesArray.sort()
				}

				for (let i = 0; i <= diasRotinaUsuario.length - 1; i++) {

					let payload = {
						weekday: diasRotinaUsuario[i]
					}

					Detalhesrotina.update(payload, {
						where: {
							[Op.and]: [{ id: idsDetalhesArray[i] }]
						}
					}).then(results => {
					});
				}
			})
			return successResponse('Rotina atualizada com sucesso.');
		}).catch(function (err) {
			return errorResponse("Erro ao atualizar suas rotinas. Erro: " + err.message);
		});
	}

	previsao(userID, bilheteUnico) {
		return this.Rotina.findOne({
			include: [{
				model: bilheteUnico
			}],
			where: { userID: bilheteUnico.id_usuario }
		}).then(function (previsao) {
			return previsao
		}).catch(function (err) {
			return errorResponse("Erro" + err.message)
		});
	}

	async createVolta(rotinaVolta){
		rotinaVolta.horario = rotinaVolta.hora_volta
		const rotina_volta = await this.Rotina.create(rotinaVolta)
		try {	
			if(rotina_volta){
				return rotina_volta.dataValues

			}

		} catch(e){

		}

	}



	getRotina(rotinaID) {

		return this.Rotina.findOne({ where: { id: rotinaID } })
		.then(function (rotina) {
			if (rotina) {
				return rotina
			}
		});
	};

	deleteRotina(userID, rotinaID) {
		return this.Rotina.destroy({
			where: {
				[Op.and]: [{ id: rotinaID }, { usuario_id: userID }]
			}
		}).then(function (rotina) {

			return successResponse('Rotina excluída com sucesso.');
		}).catch(function (err) {
			return errorResponse("Erro ao excluir sua rotina. Erro: " + err.message);
		});
	}
}

module.exports = RotinaController;
