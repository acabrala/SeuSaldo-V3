const axios = require('axios');
const util = require('util');



const errorResponse = function (message) {
    return {
        error: true,
        message: message
    }
}

class LocalizacaoController {

    local(latitude, longitude) {

        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyBLPU6jJlWuyz9u3mIvExfsJ95NZF7Gqlg";

        return axios.get(url).then((result) => {
            let cidade;
            let estado;
            // return result.data.results[0].address_components
            result.data.results[0].address_components.map((item) => {
                item.types.filter((adm_area) => {


                    if (adm_area == "administrative_area_level_2") {
                        cidade = item.long_name
                    }
                    if (adm_area == "administrative_area_level_1") {
                        estado = item.long_name
                    }

                });
            })
            return {
                error: false,
                Cidade: cidade,
                Estado: estado
            }

        })
    }

}

module.exports = LocalizacaoController;