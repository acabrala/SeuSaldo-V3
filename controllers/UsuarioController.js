const uuid = require('uuid-v4');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sender = require('../services/email');
const util = require('util');
const bcrypt = require('bcrypt-nodejs');
const x = ""
const i = ""
let routesAll = []
const axios = require('axios');
const request = require('request');
const fs = require('fs');

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

class UsuarioController {
	constructor(Usuario) {
		this.Usuario = Usuario;
	}

	create(usuario) {
		const id = uuid();

		let _this = this;
		let _usuario = this.Usuario;

		usuario.id = id;

		return _this.alreadyHasFacebookAccount(usuario.email)
			.then(function (facebookUser) {
				if (facebookUser) {
					return errorResponse("Este email já está sendo utilizado em uma conta do Facebook.");
				} else {
					return _this.alreadyHasGoogleAccount(usuario.email)
						.then(function (googleUser) {
							if (googleUser) {
								return errorResponse("Este email já está sendo utilizado em uma conta do Google.");
							} else {

								_this.find({ where: { mobile_cadastro: usuario.mobile_cadastro } })
									.then(mobileUser => {
										if (mobileUser.length >= 5) {
											return errorResponse("Limite de cadastro excedido")
										}
									})
								return _usuario
									.create(usuario)
									.then(function (usuario) {
										return successResponse('Usuário inserido com sucesso.');
									}).catch(function (err) {
										return errorResponse(err.message);
									});
							}
						});
				}
			});
	}

	update(userID, usuario) {
		return this.Usuario.update(usuario, {
			where: { id: userID }
		}).then(function (usuario) {
			return successResponse('Usuário atualizado com sucesso.');
		}).catch(function (err) {
			return errorResponse(err.message);
		});
	}

	// login facebook ou google
	getFacebookOrGoogleUser(authUser, bilheteUnico, rotina) {
		let _usuario = this.Usuario;
		let _this = this;

		let idAuthUser = authUser.id;

		return this.Usuario.findOne({ where: { id: idAuthUser } })
			.then(function (usuario) {
				// Encontrou usuário
				if (usuario) {
					return _usuario.find({
						include: [{
							model: bilheteUnico
						},
						{ model: rotina }],
						where: { id: idAuthUser }
					}).then(function (usuario) {

						// Tem bilhete unico
						if (_this.hasBilheteUnico(usuario)) {
							if (_this.hasRotina(usuario)) {

								const rotinas = _this.getRotina(usuario);
								const bilhete = _this.getBilheteUnico(usuario);
								const usuarioFinal = _this.normalizeUser(usuario, bilhete, rotinas);

								let response = {
									error: false,
									usuario: usuarioFinal
								};

								return response;

							}
						} else {
							// Não tem bilhete unico
							const usuarioFinal = _this.normalizeUser(usuario, null, null);
							let response = {
								error: false,
								usuario: usuarioFinal
							};

							return response;
						}
					}).catch(function (err) {
						return errorResponse(err.message);
					});
				} else {
					// Cria usuário
					_usuario.find({ where: { mobile_cadastro: authUser.mobile_cadastro } })
						.then(mobileUser => {
							if (mobileUser.length >= 5) {
								return errorResponse("Limite de cadastro excedido")
							}
						})
					return _usuario
						.create(authUser)
						.then(function (usuario) {
							delete usuario.dataValues.is_facebook;
							delete usuario.dataValues.is_google;

							let response = {
								error: false,
								usuario: usuario.dataValues
							};

							return response;
						}).catch(function (err) {

							return _usuario
								.findOne({ where: { email: authUser.email } })
								.then(function (usuario) {

									return _usuario.find({
										include: [
											{ model: bilheteUnico },
											{ model: rotina }],
										where: { id: usuario.id }
									}).then(function (usuario) {

										// Tem bilhete unico
										if (_this.hasBilheteUnico(usuario)) {
											if (_this.hasRotina(usuario)) {

												const rotinas = _this.getRotina(usuario);

												const bilhete = _this.getBilheteUnico(usuario);

												const usuarioFinal = _this.normalizeUser(usuario, bilhete, rotinas);

												let response = {
													error: false,
													usuario: usuarioFinal
												};

												return response;

											}
										} else {
											// Não tem bilhete unico
											const usuarioFinal = _this.normalizeUser(usuario, null, null);

											let response = {
												error: false,
												usuario: usuarioFinal
											};

											return response;
										}
									}).catch(function (err) {
										return errorResponse(err.message);

									})
								})
						});
				}
			}).catch(function (err) {
				return errorResponse(err.message);
			});
	}

	getUser(email, senha, bilheteUnico, rotina) {

		let _usuario = this.Usuario;
		let _this = this;

		return this.Usuario.findOne({ where: { email } })
			.then(function (usuario) {
				if (_usuario.isPassword(usuario.senha, senha)) {
					const payload = {
						id: usuario.id
					};

					return _usuario.find({
						include: [
							{ model: bilheteUnico },
							{ model: rotina }],
						where: { id: usuario.id }
					}).then(function (usuario) {

						let promise = new Promise((resolve, reject) => resolve(usuario));

						// Tem bilhete unico
						if (_this.hasBilheteUnico(usuario)) {
							if (_this.hasRotina(usuario)) {

								return promise.then(usuario => {
									const rotinas = _this.getRotina(usuario);
									const bilhete = _this.getBilheteUnico(usuario);
									const usuarioFinal = _this.normalizeUser(usuario, bilhete, rotinas);

									let response = {
										error: false,
										usuario: usuarioFinal
									};
									return response;
								})
							} else {
								const bilhete = _this.getBilheteUnico(usuario);
								const usuarioFinal = _this.normalizeUser(usuario, bilhete, null)

								let response = {
									error: false,
									usuario: usuarioFinal,
									rotina: rotinas
								};

								return response;

							}

						} else {
							// NÃ£o tem bilhete unico
							const usuarioFinal = _this.normalizeUser(usuario, null, null);
							let response = {
								error: false,
								usuario: usuarioFinal
							};

							return response;
						}

					}).catch(function (err) {
						return errorResponse(err.message);
					});

				} else {
					return errorResponse("Senha inválida");
				}
			}).catch(function (err) {
				return errorResponse("Usuário não encontrado. Verifique se você já possui uma conta usando o Facebook ou Google.");
			});
	}

	getRotinaId(rotinas, DetalhesRotina) {

		for (let k = 0; k < rotinas.length; k++) {
			let rotinaIds = {}
			rotinaIds.id = rotinas[k].dataValues.id
			DetalhesRotina.findAll({ where: { id_rotina: rotinas[k].dataValues.id } }).then(function (dias) {
				if (!dias) {
				}
				for (let l = 0; l < dias.length; l++) {

					rotinaIds[diasSemana[l]] = dias[l].dataValues.weekday

				}
				routesAll.push(rotinaIds)
				return routesAll
			})
		}
	}

	getDias(IdsRotinas) {

		let uri = "http://www.zazzi.com.br:3000/getUser"

		return axios.post(uri, IdsRotinas, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(function (response) {
			return {
				error: false,
				response: response.data
			}
		}).catch(function (error) {
		});
	}


	diasRotina(rotinas, DetalhesRotina) {
		let routesAll = []
		let diasSemana = ['domingo',
			'segunda',
			'terca',
			'quarta',
			'quinta',
			'sexta',
			'sabado'];

		let rotinaIds = {}

		for (let k = 0; k < rotinas.length; k++) {
			rotinaIds.id = rotinas[k].dataValues.id
			DetalhesRotina.findAll({ where: { id_rotina: rotinas[k].dataValues.id } })
				.then(function (dias) {
					if (!dias) {

					} else {
						for (let l = 0; l < dias.length; l++) {

							rotinaIds[diasSemana[l]] = dias[l].dataValues.weekday

						}
						routesAll.push(rotinaIds)
					}
				})
		}
	}

	hasBilheteUnico(usuario) {
		if (usuario.dataValues.BilheteUnicos) {
			return true;
		} else {
			return false;
		}
	}

	getBilheteUnico(usuario) {
		return usuario.dataValues.BilheteUnicos;
	}

	hasRotina(usuario) {
		if (usuario.dataValues.Rotinas) {
			return true;
		} else {
			return false;
		}
	}

	getRotina(usuario) {
		return usuario.dataValues.Rotinas

	}

	normalizeUser(usuario, bilhete, rotina) {
		delete usuario.dataValues.BilheteUnicos;
		delete usuario.dataValues.senha;
		delete usuario.dataValues.is_facebook;
		delete usuario.dataValues.is_google;
		delete usuario.dataValues.Rotinas;

		if (bilhete) {
			usuario.dataValues.bilhete_unico = bilhete;
			if (rotina) {
				usuario.dataValues.rotina = rotina;

			}
		}
		return usuario.dataValues;
	}

	alreadyHasFacebookAccount(email) {
		return this.Usuario.findOne({
			where: {
				[Op.and]: [
					{ email: email },
					{ is_facebook: 1 }
				]
			}
		}).then(function (usuario) {
			if (usuario) {
				return true;
			}
			return false;
		}).catch(function (err) {
			return errorResponse(err.message);
		});
	}

	alreadyHasGoogleAccount(email) {
		return this.Usuario.findOne({
			where: {
				[Op.and]: [
					{ email: email },
					{ is_google: 1 }
				]
			}
		}).then(function (usuario) {
			if (usuario) {
				return true;
			}
			return false;
		}).catch(function (err) {
			return errorResponse(err.message);
		});
	}

	resetUserPassword(email) {
		let _usuario = this.Usuario;


		return this.Usuario.findOne({ where: { email } })
			.then(function (usuario) {
				if (usuario) {
					// generate code
					let code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
					usuario = usuario.dataValues;
					usuario.code = code;

					let codigo = {
						code: code
					};
					let nome = usuario.nome

					return _usuario.update(codigo, {
						where: { id: usuario.id }

					}).then(function (usuario) {

						return sender.send(email, code, nome)
							.then(function (info) {
								return successResponse('O código de recuperação de senha foi enviado para o seu email')
							}).catch(function (err) {

								return errorResponse(err.message);
							});
					}).catch(function (err) {
						return errorResponse(err.message);
					});
				} else {
					return errorResponse("Usuário não encontrado.");
				}
			}).catch(function (err) {
				return errorResponse(err.message);
			});
	}

	verifyUserCode(email, code) {
		const resetPasswordToken = require('crypto').randomBytes(32).toString('hex');

		let _usuario = this.Usuario;

		return this.Usuario.findOne({ where: { email } })
			.then(function (usuario) {
				if (usuario) {

					// verifica se os códigos são iguais
					if (usuario.code === code) {
						// atualizar token
						usuario = usuario.dataValues;
						let nomeUser = usuario.nome
						usuario.password_reset_token = resetPasswordToken;

						let token = {
							password_reset_token: resetPasswordToken
						}
						return _usuario.update(token, {
							where: { id: usuario.id }
						}).then(function (usuario) {
							let response = {
								error: false,
								message: 'Código válido',
								password_token: resetPasswordToken,
								nome: nomeUser
							};
							return response;
						}).catch(function (err) {
							return errorResponse(err.message);
						});

					} else {
						return errorResponse("Código inválido.");
					}
				} else {
					return errorResponse("Usuário não encontrado.");
				}
			}).catch(function (err) {
				return errorResponse(err.message);
			});
	}

	changeUserPassword(email, newPassword, passwordToken) {

		let _usuario = this.Usuario;

		return this.Usuario.findOne({ where: { email } })
			.then(function (usuario) {
				if (usuario) {

					// verifica se os códigos são iguais
					if (usuario.password_reset_token === passwordToken) {
						// atualizar token
						const salt = bcrypt.genSaltSync();

						usuario = usuario.dataValues;

						let payloadSenha = {
							senha: bcrypt.hashSync(newPassword, salt)
						}

						return _usuario.update(payloadSenha, {
							where: { id: usuario.id }
						}).then(function (usuario) {
							return successResponse('Senha atualizada com sucesso');
						}).catch(function (err) {
							return errorResponse(err.message);
						});
					} else {
						return errorResponse("Token inválido.");
					}
				} else {
					return errorResponse("Usuário não encontrado.");
				}
			}).catch(function (err) {
				return errorResponse(err.message);
			});
	}
}

module.exports = UsuarioController;