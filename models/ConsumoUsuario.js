module.exports = function(Sequelize, DataTypes){
	var ConsumoUsuario = Sequelize.define('ConsumoUsuario', {
		id: {
		    type: DataTypes.INTEGER,
		    primaryKey: true,
		    autoIncrement: true
		},	
		vou_gastar_dia_onibus: DataTypes.DECIMAL(5,2),
		vou_gastar_dia_trilho: DataTypes.DECIMAL(5,2),
		vou_gastar_dia_integracao: DataTypes.DECIMAL(5,2),
		vou_gastar_semana_onibus: DataTypes.DECIMAL(5,2),
		vou_gastar_semana_trilho: DataTypes.DECIMAL(5,2),
        vou_gastar_semana_integracao: DataTypes.DECIMAL(5,2),
		vou_gastar_mes_onibus: DataTypes.DECIMAL(5,2),
		vou_gastar_mes_trilho: DataTypes.DECIMAL(5,2),
        vou_gastar_mes_integracao: DataTypes.DECIMAL(5,2),
		ja_gastei_dia_onibus: DataTypes.DECIMAL(5,2),
		ja_gastei_dia_trilho: DataTypes.DECIMAL(5,2),
        ja_gastei_dia_integracao: DataTypes.DECIMAL(5,2),
		ja_gastei_semana_onibus: DataTypes.DECIMAL(5,2),
		ja_gastei_semana_trilho: DataTypes.DECIMAL(5,2),
        ja_gastei_semana_integracao: DataTypes.DECIMAL(5,2),
        ja_gastei_mes_onibus: DataTypes.DECIMAL(5,2),
        ja_gastei_mes_trilho: DataTypes.DECIMAL(5,2),
        ja_gastei_mes_integracao: DataTypes.DECIMAL(5,2),
	},
	{
		freezeTableName: true,
		timestamps: false,
		omitNull: false,
		tableName: 'consumo_usuario'
	});

	return ConsumoUsuario;
};
