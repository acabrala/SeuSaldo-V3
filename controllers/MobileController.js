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

class MobileController {
	constructor(Mobile) {
		this.Mobile = Mobile;
	}

	async create(mobile) {

		return await this.Mobile.findOne({ where: { serial: mobile.serial } })
			.then(mobile_result => {
				if (!mobile_result) {
					console.log(mobile)
					this.Mobile.create(mobile)
						.then((result) => {
							return {
								error: false,
								message: "Celular cadastrado com sucesso",
								mobile: result,
								versao_compativel: "3.0"
							}
						}).catch(error => {
							return {
								error: true,
								message: "Erro ao gerar novo mobile. Erro:" + err
							}
						});

				} else {
					return {
						error: true,
						message: "Não foi possível gerar terminal",
						id_mobile: mobile_result.dataValues.id_mobile,
						versao_compativel: '3.0'
					}
				}
			}).catch(err => {
				console.log(err)
			})
	}


	async update(mobile, idMobile) {

		this.Mobile.findOne({ where: { id_mobile: idMobile } })
			.then(mobile_cadastrado => {
				if (!mobile_cadastrado) {

					this.Mobile.update(mobile, {
						where:
						{
							id_mobile: idMobile
						}
					}).then(celular_Atualizado => {

						return successResponse('Celular atualizado com sucesso')

					}).catch(err => {
						return errorResponse(err)
					})

				}
			})
	}
}

module.exports = MobileController;