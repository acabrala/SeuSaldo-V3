module.exports = function(Sequelize, DataTypes){
	var Mobile = Sequelize.define('mobile', {
		id_mobile: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},
		serial: DataTypes.STRING,
		imei: DataTypes.STRING,
		id_so : DataTypes.INTEGER,
		fabricante: DataTypes.STRING,
		modelo: DataTypes.STRING,
		sim_card: DataTypes.STRING,
		versao_app: DataTypes.STRING,
		versao_so: DataTypes.STRING,
		is_nfc: DataTypes.TINYINT,
		nfc_compativel: DataTypes.TINYINT,
		campanha: DataTypes.STRING,
		canal: DataTypes.STRING,
	},
	{
		freezeTableName: true,
		timestamps: false
	});
	return Mobile;
};