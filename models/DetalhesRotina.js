module.exports = function(Sequelize, DataTypes){
	var DetalhesRotina = Sequelize.define('DetalhesRotina', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		id_rotina: DataTypes.INTEGER,
		weekday: DataTypes.INTEGER,
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'detalhes_rotina'
    });
    
	return DetalhesRotina;
};
