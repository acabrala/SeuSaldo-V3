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

		let diasRotinaUsuario = [];
		let bu = await this.BilheteUnico.create(bilhete)

		if (bu) {
			rotina.usuario_id = userID;
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

		} else {

			return 

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