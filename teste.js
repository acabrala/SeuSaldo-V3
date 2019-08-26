const mysql = require('mysql');

var config = {
	host: 'localhost',
	user: 'root',
	password: 'MKTz@zz1',
	database: 'seusaldo_dev'
}



const conn = new mysql.createConnection(config);

conn.connect(
	function (err){
		if(err) {
			console.log("error")
			throw err;
		}
		else {
			     console.log("Connection established.");
			     queryZerarFlag();

		}
	})


function queryZerarFlag() {
	conn.query('update rotina set flag = 0'
,function(err, results, fields){
		if (err) throw err;
		console.log("update realizado com sucesso")
		})

		conn.end(function(err){
			if (err) throw err;
			else console.log('fechado')
		})
	
	
};