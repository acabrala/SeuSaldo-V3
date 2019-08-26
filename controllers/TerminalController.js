const axios = require('axios');
const request = require('request');
const fs = require('fs');
const util = require('util');



const errorResponse = function(message){
 return {
   error: true,
   message: message
 }
}



class TerminalController{ 

  callProcess(envio){  


    let path = "java -jar /home/admin_/redepontocerto.jar " + JSON.stringify(envio);
    var execSync = require('child_process').execSync, child;
    child = execSync(path); 


    if(!child){
      return { 
       error: true,
       message: error
     }
   }            

   let result = child.toString().split('\n');
   let serial = result[1];
   let checksum = result[2];


   return {
    error: false,
    data: {
     serial: serial,
     checksum: checksum
   }
 }
}    


callRPC(juncao){ 

  var headers = {
   'Content-Type':'application/json'
 };

 var rejectUnauthorized = false;
 let uri = "https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-3.0/inicializar"

console.log('juncao' + juncao)
 return axios.post(uri, juncao, {
  headers: {
    'Content-Type':'application/json'
  }
}).then(function(response){

  var retorno = response.data.token 
  var terminal = response.data.codigoTerminal


                   // return retorno;
                   return {
                     error: false,
                     token: retorno,
                     terminal: terminal
                   }
                 }).catch(function(error){
                   console.log(error)
                 });                    
               }        

               callRpcCartao(token,numeroCartao, numeroTerminal){

                 var bilhete = {'numeroCartao': numeroCartao}
                 let teste = {'numeroTerminal': parseFloat(numeroTerminal)} 
                 var dados = {'numeroCartao': numeroCartao,
                 'idTerminal': parseInt(numeroTerminal)} 

                 let uri = "https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-3.0/cartao/chave"   
                 return axios.post(uri, dados, {
                   headers: {
                     'Content-Type':'application/json',
                     'token': token                    }
                   }).then(function(response){ 
                    var chave = response.data.chave; 
                    return {
                     error:false,
                     chave: chave                    }
                   }).catch(function(error){
                     return {
                       error: true,
                       message:'Ocorreu algum erro'+ error
                     }
                   })
                 }

callRpcCarteiras(token, numeroCartao, numeroTerminal) {

        let estudante = false;
        let passelivre = true;
        let comum = false;
        let diarioTrilho = false;
        let diarioOnibus = false;
        let diarioIntegracao = false;
        let valeTransporte = true;

   
        var bilhete = { 'numeroCartao': numeroCartao }
        let teste = { 'numeroTerminal': parseFloat(numeroTerminal) }

        var dados = {
            'numeroCartao': numeroCartao,
            'idTerminal': parseInt(numeroTerminal)
        }

        let uri = "https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-3.0/cartao/consultarProduto"
        return axios.post(uri, dados, {
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }).then(function (response) {


            var produtos = response.data.produtos

            if (produtos.length == 1) {

              comum = true;
              valeTransporte = false;
              passelivre = false
            } else {
              let i;
              for (i = 0; i < produtos.length -1; i++) {



              switch (produtos[i].id) {
                case 1:
                    estudante = true
                    passelivre = false
                    break
                case 2:
                    comum = true
                    break
                case 30:
                    diarioOnibus = true
                    break
                case 33:
                    diarioTrilho = true
                    break
                case 36:
                    diarioIntegracao = true
                    break
        }
    }
}

            return {
                error: false,
                comum: comum,
                estudante: estudante,
                passelivre: passelivre,
                diarioIntegracao: diarioIntegracao,
                diarioTrilho: diarioTrilho,
                diarioOnibus: diarioOnibus,
                valeTransporte: valeTransporte
            }
        }).catch(function (error) {
          console.log(error)
            console.log(error.response)
            return {
                error: true,
                codigo: error.response.status,
                message: error.response.statusText
            }
            console.log(error)
        })
    }
}

module.exports = TerminalController;
