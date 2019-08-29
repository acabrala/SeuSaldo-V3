module.exports = function(Sequelize, DataTypes){
	var Interesse = Sequelize.define('Interesse', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
        email: DataTypes.STRING,
        nome: DataTypes.STRING,
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
		telefone:  DataTypes.STRING,
		cidade:DataTypes.STRING,
		estado: DataTypes.STRING,
		cidade_localizacao: DataTypes.STRING,
		estado_localizacao: DataTypes.STRING,
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'interesse'
	});

	return Interesse;
};
