const tokenGenerator = require('tokgen');
const moment = require('moment-timezone');
const Sequelize = require('sequelize')
const sender = require('../token/sender');
let generator = new tokenGenerator({ chars: '0-9a-zA-Z', length: 65 });
const tokenEmail = generator.generate()
let hora_atual = moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss")
const Op = Sequelize.Op

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

	async create(token, id_usuario, email, id_mobile, id_so) {

		let payload = {
			id_usuario : id_usuario,
			token_email: tokenEmail,
			flag_ativado: 0,
			data_criado: hora_atual,
			id_mobile: id_mobile
		}
		
		let nome = token.nome;
		return this.Token.findOne({
			where: {
				id_usuario: id_usuario, flag_Ativado: 1
			}
		}).then(ativado => {

			if (ativado) {
				return errorResponse('email já ativado')
			} else {
				return this.Token.count({ where: { id_usuario: id_usuario } })
					.then(tokens => {
						if (tokens > 0) {
							return this.Token.update({ flag_ativo: 0 }, {
								where: {
									id_usuario: id_usuario
								}
							}).then(result => {
								return this.Token.create(payload).then(novoToken => {
									return successResponse('Novo token gerado')
								})
							})
						} else {
							return this.Token.create(payload)
								.then(response => {
									sender.send(email, tokenEmail, nome, id_so)
									return successResponse("token gerado com sucesso")
								})
						}
					})
			}
		})
	}

	async ativarToken(token, tokenEmail, IdUsuario) {
		this.Token.count({
			where: {
				[Op.and]:
					[{ token_email: tokenEmail }, { flag_ativo: 1 }, { id_mobile: token.id_mobile }]
			}
		}).then(dados => {
			if (dados == 0) {
				return errorResponse("Ocorreu algum erro")
			} else {
				let result = dados.dataValues;

				this.Token.findOne({
					where: { token_email: tokenEmail, flag_ativo: 1 }, flag_ativado: 0
				}).then(resultado => {
					if(resultado == null) {
						return errorResponse("Token já enviado")
					} else {
						let horaToken = resultado['data_criado']
						let diferencaToken = hora_atual.diff(horaToken, 'minutes')
						if(diferencaToken > 5){
							return errorResponse("Ops desculpe, este token já expirou")
						} else {
							this.Token.update({flag_Ativado: 1},
								{where: {
									token_email: tokenEmail
								}})
						}

						return {
							error: false,
							message: "Cadastrado ativado com sucesso"
					
						};
					}
				})
			}
		})
	}
}

module.exports = TokenController;