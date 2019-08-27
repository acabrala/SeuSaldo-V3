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
        telefone:  DataTypes.STRING
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'interesse'
	});

	/*
	BilheteUnico.associate = function(models){
		BilheteUnico.hasOne(models.Usuario, {foreignKey: 'id_usuario'})
	}
	*/
	return Interesse;
};
