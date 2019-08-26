const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
	database: 'seusaldo_v2',
	username: 'root',
	password: 'MKTz@zz1',
	pool: {
      max: 10,
      min: 1,
      idle: 15000
	},
	params: {
		dialect: 'mysql',
		define: {
			underscored: true
		}
	},
	jwtSecret: crypto,
	jwtSession: {
		session: false
	}
}
