const axios = require('axios');
const request = require('request');
const fs = require('fs');
const util = require('util');



const errorResponse = function (message) {
  return {
    error: true,
    message: message
  }
}

class TerminalController {

  callProcess(envio) {

    let path = "java -jar /home/admin_/redepontocerto.jar " + JSON.stringify(envio);
    let execSync = require('child_process').execSync, child;
    child = execSync(path);

    if (!child) {
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


  callRPC(juncao) {

    let headers = {
      'Content-Type': 'application/json'
    };

    let rejectUnauthorized = false;
    let uri = "https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-3.0/inicializar"

    return axios.post(uri, juncao, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {

      let retorno = response.data.token
      let terminal = response.data.codigoTerminal

      return {
        error: false,
        token: retorno,
        terminal: terminal
      }
    }).catch(function (error) {
    });
  }

  callRpcCartao(token, numeroCartao, numeroTerminal) {

    let bilhete = { 'numeroCartao': numeroCartao }
    let teste = { 'numeroTerminal': parseFloat(numeroTerminal) }
    let dados = {
      'numeroCartao': numeroCartao,
      'idTerminal': parseInt(numeroTerminal)
    }

    let uri = "https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-3.0/cartao/chave"
    return axios.post(uri, dados, {
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    }).then(function (response) {
      let chave = response.data.chave;
      return {
        error: false,
        chave: chave
      }
    }).catch(function (error) {
      return {
        error: true,
        message: 'Ocorreu algum erro' + error
      }
    })
  }

  callRpcVem(token, numeroCartao, numeroTerminal) {
    let saldoComum = 0.00;
    let saldoEstudadnte = 0.00;

    let uri = `https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-5.0/saldo/consulta/vem/${numeroCartao}`
    return axios.get(uri,
      {
        headers: {
          'token': token
        }
      }).then((result) => {
        let resultado = result.data.data.listaTiposCredito
        if (resultado.hasOwnProperty('900')) {
          saldoEstudadnte = resultado['900'].saldoCartao

          return {
            error: false,
            saldo_estudante: saldoEstudadnte,
            recarga_disponivel: resultado['900'].recargaDisponivel,
            estudante: true
          }

        }
        if (resultado.hasOwnProperty('500')) {
          saldoComum = resultado['500'].saldoCartao
          return {
            error: false,
            saldo_comum: saldoComum,
            recarga_disponivel: resultado['500'].recargaDisponivel,
            estudante: false
          }

        }
      }).catch((err) => {
        return {
          error: true,
          status: err.response.status,
          message: err.response.statusText
        }
      })
  }


  callRpcBem(token, numeroCartao, numeroTerminal) {
    let saldoComum = 0.00;
    let saldoEstudadnte = 0.00;

    let uri = `https://integracao.redepontocerto.com.br:8473/mobile-server-integracao-5.0/saldo/consulta/bem/${numeroCartao}`
    return axios.get(uri,
      {
        headers: {
          'token': token
        }
      }).then((result) => {
        let resultado = result.data.data.listaTiposCredito
        if (resultado.hasOwnProperty('900')) {
          saldoEstudadnte = resultado['900'].saldoCartao
          saldoComum = resultado['500'].saldoCartao

          let response = {
            escolar: {
	      error: false,
              saldo_estudante: saldoEstudadnte,
              recarga_disponivel: resultado['900'].recargaDisponivel,
              estudante: true
            },
            cidadao: {
	      error: false,
              saldo_comum: saldoComum,
              recargaDisponivel: resultado['500'].recargaDisponivel
            }
          }
          return response
        }
        if (resultado.hasOwnProperty('500')) {
          saldoComum = resultado['500'].saldoCartao
          return {
            saldo_comum: saldoComum,
            recarga_disponivel: resultado['500'].recargaDisponivel
          }
        }
      }).catch((err) => {
        return {
          error: true,
          status: err.response.status,
          message: err.response.statusText
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

    let dados = {
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

      let produtos = response.data.produtos

      if (produtos.length == 1) {

        comum = true;
        valeTransporte = false;
        passelivre = false
      } else {
        let i;
        for (i = 0; i < produtos.length - 1; i++) {

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
      return {
        error: true,
        codigo: error.response.status,
        message: error.response.statusText
      }
    })
  }
}

module.exports = TerminalController;
