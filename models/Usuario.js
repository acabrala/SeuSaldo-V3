const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function(sequelize, DataTypes){
	var Usuario = sequelize.define('Usuario', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
      		autoIncrement: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			unique: {
				args: true,
				msg: 'Este email já esta sendo utilizado por outra conta.'
			}
		},
		senha: DataTypes.STRING,
		data_criacao: {
			type: DataTypes.STRING
		},
		sexo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		notification_token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		cpf: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: {
				args: true,
				msg: 'Este CPF já esta sendo utilizado por outra conta.'
			}
		},
		telefone: DataTypes.STRING,
		data_nascimento: DataTypes.STRING,
		is_facebook: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		is_google: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		cadastro_ativo: DataTypes.BOOLEAN,
		mobile_cadastro: DataTypes.INTEGER,
		mobile_logado: DataTypes.INTEGER,
		code: DataTypes.STRING,
		password_reset_token: DataTypes.STRING,
		push_ativo: DataTypes.BOOLEAN,
		push_enviado: DataTypes.BOOLEAN,
	},
	{
		hooks: {
			beforeCreate: function(usuario){
				if(!Usuario.isGoogle(usuario) && !Usuario.isFacebook(usuario)){
					const salt = bcrypt.genSaltSync();
					usuario.set('senha', bcrypt.hashSync(usuario.senha, salt));
				}
			}
		},
		freezeTableName: true,
		timestamps: false,
		tableName: 'usuario'
	});

	Usuario.isFacebook = function(usuario){
		return usuario.is_facebook;
	}

	Usuario.isGoogle = function(usuario){
		return usuario.is_google;
	}

	Usuario.isPassword = function(encodedPassword, password){
		return bcrypt.compareSync(password, encodedPassword);
	}

	Usuario.associate = function(models){
		Usuario.hasMany(models.BilheteUnico, {foreignKey: 'id_usuario'}),
		Usuario.hasMany(models.Rotina, {foreignKey: 'usuario_id'})
		Usuario.hasMany(models.ConsumoUsuario, {foreignKey: 'id_usuario'});


	}

	return Usuario;
}
