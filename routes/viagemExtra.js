const ViagemExtraController = require('../controllers/ViagemExtraController');


module.exports = function (app) {

	const viagemExtraController = new ViagemExtraController(app.datasource.models.BilheteUnico);

	app.post('/ve/:usuario_id/:bilhete_id', function (req, res) {

		let userID = req.params.usuario_id;
		let bilheteID = req.params.bilhete_id;
		let desconto = req.body.valor;
		let quantidadeOnibus = req.body.quantidadeOnibus;
		let quantidadeTrilho = req.body.quantidadeTrilho;
		let quantidadeIntegracao = req.body.quantidadeIntegracao;
		let valorNegativo = req.body.valorNegativo;

		viagemExtraController.viagemExtra(userID, bilheteID, desconto, quantidadeOnibus, quantidadeTrilho, quantidadeIntegracao, valorNegativo)
			.then(function (response) {
				res.json(response)
			});
	});
}
