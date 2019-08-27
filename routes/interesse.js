
const InteresseController = require('../controllers/InteresseController');

module.exports = function (app) {

    const interesseController = new InteresseController(app.datasource.models.Interesse);
   

    // Salvar nova consulta
    app.post('/interesse', function (req, res, next) {

        console.log()
        interesseController.create(req.body)
            .then((result) => {
                res.json(result)

            }).catch((err) => {

            })

});

}

