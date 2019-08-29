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

		console.log(typeof(this.Mobile));
		 
		console.log("vai caraio");
		

		// return this.Mobile.findOne().then(result => {
		// 	return result
		// })
		// await this.Mobile.findOne({ where: { serial: mobile.serial } })
		// 	.then(mobile => {
		// 		if (mobile) {

		// 			return {
		// 				error: true,
		// 				message: "Não foi possível gerar terminal",
		// 				mobile: mobile,
		// 				versao_compativel: '3.0'
		// 			}
		// 		} else {
		// 			this.Mobile.create(mobile)
		// 				.then((result) => {
		// 					return {
		// 						error: false,
		// 						message: "Celular cadastrado com sucesso",
		// 						mobile: result,
		// 						versao_compativel: "3.0"
		// 					}
		// 				}).catch(error => {
		// 					return {
		// 						error: true,
		// 						message: "Erro ao gerar novo mobile. Erro:" + err
		// 					}
		// 				});
		// 		}
		// 	}).catch(err => {
		// 		console.log(err)
		// 	})

		// return this.Mobile.create(mobile)
		// 	.then(function (mobile) {
		// 		return successResponse('Mobile inserido com sucesso.');
		// 	}).catch(function (err) {
		// 		return errorResponse(err.message);
		// 	});
	}
}

module.exports = MobileController;