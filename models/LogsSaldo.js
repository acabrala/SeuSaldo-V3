module.exports = function(Sequelize, DataTypes){
	var LogsSaldo = Sequelize.define('LogsSaldo', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		id_tipo_saldo: DataTypes.INTEGER,
		id_operacao: DataTypes.INTEGER,
		saldo_anterior: DataTypes.STRING,
		saldo_apos: DataTypes.STRING,
		horario_desconto: DataTypes.STRING,
		quantidade_ve: DataTypes.STRING,
		id_bilhete: DataTypes.INTEGER,
		
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'logs_saldo'
    });

    return LogsSaldo;
};
