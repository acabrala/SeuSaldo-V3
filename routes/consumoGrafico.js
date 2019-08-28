
const ConsumoGraficoController = require('../controllers/ConsumoGraficoController');

module.exports = function (app) {

    const consumoGraficoController = new ConsumoGraficoController(app.datasource.models.ConsumoUsuario);
    const DetalhesRotina = app.datasource.models.DetalhesRotina;
    const Rotina = app.datasource.models.Rotina;
    const BilheteUnico = app.datasource.models.BilheteUnico;

    // Salvar nova consulta
    app.get('/graficosUsuario/:id_usuario/:id_bilhete/:flag_bilhete_unico', function (req, res, next) {

        let userID = req.params.id_usuario;
        let bilheteID = req.params.id_bilhete;
        let flagBilheteUnico = parseInt(req.params.flag_bilhete_unico);
        
        consumoGraficoController.getConsumo(userID, bilheteID, DetalhesRotina, Rotina, flagBilheteUnico, BilheteUnico)
        .then(function(grafico){

            res.json(grafico)
        })
        });


}



