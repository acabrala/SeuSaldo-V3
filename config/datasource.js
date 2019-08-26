const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

let database = null;

const loadModels = function(sequelize){
	const dir = path.join(__dirname, '../models');
	let models = [];

	fs.readdirSync(dir).forEach(function(file){
		const modelDir = path.join(dir, file);
		const model = sequelize.import(modelDir);
		models[model.name] = model;
	});

	Object.keys(models).forEach(modelName => {
	  	if (models[modelName].associate) {
	    	models[modelName].associate(models);
	  	}
	});

	return models;
};

module.exports = function(app){
	if(!database){
		const config = app.config;

		const sequelize = new Sequelize(
			config.database,
			config.username,
			config.password,
			config.params
		);

		database = {
			sequelize,
			Sequelize,
			models: {}
		};

		database.models = loadModels(sequelize);

		sequelize.sync().done(function(){
			return database;
		});
	}

	return database;
}
