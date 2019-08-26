module.exports = function(Sequelize, DataTypes){
	var Rotina = Sequelize.define('Rotina', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},
		horario: DataTypes.TIME,
		valor: DataTypes.DECIMAL(5,2),
		flag: DataTypes.TINYINT,
		id_tipo: DataTypes.INTEGER,
		rotina_desativada: DataTypes.BOOLEAN,
		nome_rotina: DataTypes.STRING
		},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'rotina'
	});

	Rotina.associate = function(models){
		Rotina.hasMany(models.DetalhesRotina, {foreignKey: 'id_rotina', onDelete: 'CASCADE'});
	}

	
	return Rotina;
};
