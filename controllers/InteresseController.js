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

    async create(interesse) {
        let array = {}
        let cidade;
        let estado;

        if((interesse.latitude != null)&&(interesse.longitude != null)){
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + interesse.latitude + "," + interesse.longitude + "&key=AIzaSyBLPU6jJlWuyz9u3mIvExfsJ95NZF7Gqlg";
        
        await axios.get(url).then((result) => {
            result.data.results[0].address_components.map((item) => {
                item.types.filter((adm_area) => {

                    if (adm_area === 'administrative_area_level_1') {
                        array.estado = item.long_name
                        interesse.estado_localizacao = item.long_name
                    }
            
                    if (adm_area === 'administrative_area_level_2') {
                        array.cidade = item.long_name
                        interesse.cidade_localizacao = item.long_name
                    }
                });
            })
        })

      this.Interesse.create(interesse)
        
        }else {
            this.Interesse.create(interesse)
        }
    }
}

module.exports = InteresseController;