const axios = require('axios');
const util = require('util');



const errorResponse = function(message){
    return {
        error: true,
        message: message
    }
 }

 class LocalizacaoController{

    local(latitude,longitude){

        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key=AIzaSyBLPU6jJlWuyz9u3mIvExfsJ95NZF7Gqlg";

        return axios.get(url,{
        }).then(function(response){
                
             let resposta = JSON.stringify(response.data.results[0]["formatted_address"])
             let respostaSplit = resposta.split(",");
             let separacao = respostaSplit[2].split("-");
               console.log('Retorno' + separacao[0] + separacao[1]);
              
                // // return retorno;
                return {
                    error: false,
                    Cidade:separacao[0],
                    Estado:separacao[1]
                     }
            }).catch(function(error){
                console.log(error)
            });   
    }

 }

 module.exports = LocalizacaoController;