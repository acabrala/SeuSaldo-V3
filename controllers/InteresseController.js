const axios = require("axios");
const errorResponse = function (message) {
    return {
        error: true,
        message: message
    }
}

const successResponse = function (message) {
    return {
        error: false,
        message: message
    }
}

class InteresseController {
    constructor(Interesse) {
        this.Interesse = Interesse;
    }

    create(interesse) {

        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + interesse.latitude + "," + interesse.longitude + "&key=AIzaSyBLPU6jJlWuyz9u3mIvExfsJ95NZF7Gqlg";

        return axios.get(url).then((result) => {
            let cidade;
            let estado;
            // return result.data.results[0].address_components
            result.data.results[0].address_components.map((item) => {
                item.types.filter((adm_area) => {

                    
                   if(adm_area == "administrative_area_level_2"){
                       cidade = item.long_name
                   }
                   if(adm_area == "administrative_area_level_1"){
                       estado = item.long_name
                   }
                    
                });
            })
            return cidade
            console.log(analisar)

        })

    }


    //     return this.Interesse.create(mobile)
    //         .then(function (mobile) {
    //             return successResponse('Mobile inserido com sucesso.');
    //         }).catch(function (err) {
    //             return errorResponse(err.message);
    //         });
    // }
}

module.exports = InteresseController;