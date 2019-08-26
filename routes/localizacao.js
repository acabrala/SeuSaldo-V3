
const LocalizacaoController = require('../controllers/LocalizacaoController');
const util = require('util')

module.exports = function (app){

    const localizacaoController = new LocalizacaoController();

        app.get('/localizacao/:latitude/:longitude', function(req,res){

            let latitude = req.params.latitude;
            let longitude = req.params.longitude;

                localizacaoController.local(latitude, longitude)
                .then(function(response){
                    //res.json(posicao);
                    res.json(response)
                    console.log("O retorno" + util.inspect(response))


                })

    });
}