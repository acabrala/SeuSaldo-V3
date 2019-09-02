var nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

var transportador = nodemailer.createTransport({
	service: 'gmail', //para contas gmail use "gmail"
	auth: {
		user: 'admin@zazzybr.com.br',
		pass: 'zazzy#2018'
	}
});


let options = {
	viewEngine: {
		defaultLayout: 'template.hbs',
		extname: '.hbs',
		partialsDir: './templates/email',
		layoutsDir: './templates/email'
	},
	viewPath: 'templates/email',
	extName: '.hbs'
};


transportador.use('compile', hbs(options))

exports.send = function (email, code, nome, id_so) {

	if (id_so == 1) {

		var configuracoes = {
			from: 'admin@zazzybr.com.br',
			to: email,
			subject: 'Confirmação de E-mail Equipe Seu Saldo!.',
			template: 'template',
			context: {
				usuario_nome: nome,
				code: code
			},
		};

	} else {

		var configuracoes = {
			from: 'admin@zazzybr.com.br',
			to: email,
			subject: 'Conffirmação de e-mail equipe Seu Saldo!.',
			template: 'templateIOS',
			context: {
				usuario_nome: nome,
				code: code
			},
		};
	}

	transportador.sendMail(configuracoes, function (error, info) {

		if (error) {
			console.log(error);
		} else {
			console.log('Email enviado ' + info.response);
		}
	});
}