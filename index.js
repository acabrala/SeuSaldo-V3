const app = require('./app');

app.listen(app.get('port'), function(){
	console.log("App running on PORT " + app.get('port'));
});