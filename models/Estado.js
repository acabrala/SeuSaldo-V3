module.exports = function(Sequelize, DataTypes){
	var Estado = Sequelize.define('Estado', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
        nome: DataTypes.STRING,
        UF: DataTypes.STRING,
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'estado'
    });
    
    Estado.associate = function(models){
		Estado.hasMany(models.Cidade, {foreignKey: 'estado'})
	}

	return Estado;
};
