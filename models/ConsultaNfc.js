module.exports = function(Sequelize, DataTypes){
	var ConsultaNfc = Sequelize.define('ConsultaNfc', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		horario_consulta: DataTypes.STRING,
		id_mobile: DataTypes.INTEGER,
		saldo_comum: DataTypes.DECIMAL(5,2),
		saldo_vt: DataTypes.DECIMAL(5,2),
		saldo_ve: DataTypes.DECIMAL(5,2),
		cota_onibus: DataTypes.DECIMAL(5,2),
		cota_trilho: DataTypes.DECIMAL(5,2),
		erro: DataTypes.TINYINT,
		numero_bilhete: DataTypes.INTEGER,
		passa_livre_onibus: DataTypes.STRING,
		passa_livre_trilho: DataTypes.STRING,
		tipo_cartao: DataTypes.INTEGER,
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'consulta_Nfc'
	});

	/*
	BilheteUnico.associate = function(models){
		BilheteUnico.hasOne(models.Usuario, {foreignKey: 'id_usuario'})
	}
	*/
	return ConsultaNfc;
};
