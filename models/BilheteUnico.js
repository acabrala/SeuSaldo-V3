module.exports = function(Sequelize, DataTypes){
	var BilheteUnico = Sequelize.define('BilheteUnico', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		apelido: DataTypes.STRING,
		estudante: DataTypes.TINYINT,
		numero: DataTypes.STRING,
		ultima_recarga: DataTypes.STRING,
		estado: DataTypes.STRING,
		cidade: DataTypes.STRING,
		passe_livre: DataTypes.BOOLEAN,
		saldo_comum: DataTypes.DECIMAL(7,2),
		saldo_vt: DataTypes.DECIMAL(7,2),
		saldo_estudante: DataTypes.DECIMAL(7,2),
		cota_onibus: DataTypes.INTEGER,
		cota_trilho: DataTypes.INTEGER,
		cota_diaria_onibus: DataTypes.INTEGER,
		cota_diaria_trilho: DataTypes.INTEGER,
		data_ultima_rotina: DataTypes.STRING,
		tipo_cartao: DataTypes.STRING,
		flag_carteira_vt: DataTypes.BOOLEAN,
		flag_carteira_passe_livre: DataTypes.BOOLEAN,
		flag_carteira_estudante: DataTypes.BOOLEAN,
		flag_carteira_diario: DataTypes.BOOLEAN,
		flag_carteira_comum: DataTypes.BOOLEAN,
		ultima_recarga_estudante: DataTypes.STRING,
		ultima_recarga_vt: DataTypes.STRING,
		dias_push: DataTypes.INTEGER,
		data_duracao_credito: DataTypes.DATEONLY,
		ultima_carteira: DataTypes.INTEGER,
		flag_bilhete_unico: DataTypes.BOOLEAN,

	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'bilhete_unico'
	});

	
	BilheteUnico.associate = function(models){
		BilheteUnico.hasMany(models.Rotina, {foreignKey: 'id_bilhete', onDelete: 'CASCADE'});
		BilheteUnico.hasMany(models.DetalhesRotina, {foreignKey: 'id_bilhete', onDelete: 'CASCADE'});
		BilheteUnico.hasOne(models.ConsumoUsuario, {foreignKey: 'id_bilhete', onDelete: 'CASCADE'});
	}
	
	return BilheteUnico;
};
