module.exports = function(Sequelize, DataTypes){
	var LogRotina = Sequelize.define('LogRotina', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		hora_rotina: DataTypes.TIME,
		id_usuario: DataTypes.STRING,
		saldo_antes: DataTypes.DECIMAL(7,2),
		saldo_apos: DataTypes.DECIMAL(7,2),
		horario_desconto: DataTypes.STRING,
		valor_desconto: DataTypes.DECIMAL(5,2),
		operador: DataTypes.INTEGER
		
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'log_rotina'
	});

	/*
	BilheteUnico.associate = function(models){
		BilheteUnico.hasOne(models.Usuario, {foreignKey: 'id_usuario'})
	}
	*/
	return LogRotina;
};
