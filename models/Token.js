module.exports = function(Sequelize, DataTypes){
    var Token = Sequelize.define('Token', {
      id_usuario: DataTypes.STRING,
      id_mobile: DataTypes.STRING,
      token_email: DataTypes.STRING,
      flag_ativo: DataTypes.TINYINT,
      flag_ativado: DataTypes.TINYINT,
      data_criado: DataTypes.STRING
    },
    {
      freezeTableName: true,
      timestamps: false,
      tableName: 'token'
  
    });
    return Token;
  };