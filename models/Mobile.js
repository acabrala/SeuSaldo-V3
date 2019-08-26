module.exports = function(Sequelize, DataTypes){
	var Mobile = Sequelize.define('Mobile', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		imei: {
			type: DataTypes.STRING,
			unique: {
				args: true,
				msg: 'Este dispositivo já está cadastrado'
			}
		},
		model: DataTypes.STRING,
		brand: DataTypes.STRING
	},
	{
		freezeTableName: true,
		timestamps: false,
		tableName: 'mobile'
	});

	return Mobile;
};
