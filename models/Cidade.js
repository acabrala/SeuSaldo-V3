module.exports = function(Sequelize, DataTypes){
	var Cidade = Sequelize.define('Cidade', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
        nome: DataTypes.STRING,
        estado: DataTypes.INTEGER,
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'cidade'
    });
    
    

	return Cidade;
};
