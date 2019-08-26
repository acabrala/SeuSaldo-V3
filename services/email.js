const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars')

var transportador = nodemailer.createTransport({
	service: 'gmail',
	auth:{
		user:'admin@zazzybr.com.br',
		pass:'zazzy#2018'
	}
});

let options = {
	viewEngine: {
		extname:'.hbs',
		partialsDir: './views/email/',
		layoutsDir: './views/email/',
		defaultLayout: 'template'
	},
	viewPath: 'views/email',
	extName: '.hbs'
}

transportador.use('compile', hbs(options))

exports.send = function(email, code, nome){

	var configuracoes = {
		from: 'admin@zazzybr.com.br',
		to: email,
		subject: 'Alteração de senha - Seu Saldo!.',
		template: 'template',
		context: {
			usuario_nome: nome,
			code: code
		}

	}

	return transportador.sendMail(configuracoes)

}
