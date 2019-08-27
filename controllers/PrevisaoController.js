const mysql = require('mysql');
const moment = require('moment');
const format = require('date-format');
const util = require('util');
let duracaoSemanaVt = 0;
let duracaoSemanaVe = 0;
let duracaoSemanaVc = 0;
let duracaoSemanaPasseLivreOnibus = 0;
let duracaoSemanaPasseLivreTrilho = 0;
let duracaoSemanaOnibusDiario = 0;
let duracaoSemanaTrilhoDiario = 0;
let retornoVt = String();
let retornoVe = String();
let retornoVc = String();
let retornoPl = String();
let retornoDiario = String();
let previsoes = Array();
let dataInicio = format.asString('dd/MM/yyyy', new Date())
let i;
let update;
let data_push = String()
let dateFormat = require('dateformat');
let data = dateFormat(new Date(), 'dd/mm/yyyy')

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

class PrevisaoController {

    constructor(Previsao) {
        this.Previsao = Previsao;
    }
    
    calcularPrevisao(UserID, rotina, BilheteID, detalhesRotinas) {
        let contador = 0;
        let _this = this

        return this.Previsao.findAll({
            include: [{
                model: detalhesRotinas
            }, {
                model: rotina,
            }],
            where: { id_usuario: UserID, id: BilheteID }
        }).then(function (previsao) {

            let array = previsao[0].dataValues.DetalhesRotinas

            let id = 0;
            let arraysRotinas = []
            let objRotina = {}
            let dias_semana =
                [
                    'segunda',
                    'terca',
                    'quarta',
                    'quinta',
                    'sexta',
                    'sabado'];
            let semana = 0

            for (let i = 0; i < previsao[0].dataValues.DetalhesRotinas.length; i++) {
                if (id != 0) {
                    if (id == array[i].id_rotina) {
                        if (array[i].weekday != 0) {
                            objRotina[dias_semana[semana]] = true
                            semana++
                        } else {
                            objRotina[dias_semana[semana]] = false
                        }
                        if (i == array.length - 1) {
                            arraysRotinas.push(objRotina)
                        }
                    } else {
                        arraysRotinas.push(objRotina)
                        objRotina = {}
                        semana = 0
                        id = array[i].id_rotina
                        objRotina.id_rotina = id
                        if (array[i].weekday == 7) {
                            objRotina.domingo = true
                        } else {
                            objRotina.domingo = false
                        }
                    }
                } else {
                    id = array[i].id_rotina
                    objRotina.id_rotina = id
                    if (array[i].weekday == 7) {
                        objRotina.domingo = true
                    } else {
                        objRotina.domingo = false
                    }
                }

            }

            let dados_rotina = previsao[0].dataValues.Rotinas

            let saldo_comum = previsao[0].saldo_comum
            let saldo_vt = previsao[0].saldo_vt
            let saldo_estudante = previsao[0].saldo_estudante
            let cota_onibus = previsao[0].cota_onibus
            let cota_trilho = previsao[0].cota_trilho
            let cota_diaria_onibus = previsao[0].cota_diaria_onibus
            let cota_diaria_trilho = previsao[0].cota_diaria_trilho
            let valor = dados_rotina.valor
            let tipoViagem = dados_rotina.id_tipo
            let isPasseLivre = previsao[0].flag_carteira_passe_livre
            let previsaoPush = previsao[0].data_duracao_credito
            let isDiario = previsao[0].flag_carteira_diario

            let diasSemanas = [
                'domingo',
                'segunda',
                'terca',
                'quarta',
                'quinta',
                'sexta',
                'sabado'
            ];

            let cotaOnibus = 0;
            let cotaTrilho = 0;


            for (let k = 0; k <= 6; k++) {
                let cotaTrilhoDesconto = false;
                for (let i = 0; i <= (dados_rotina.length - 1); i++) {
                    if (arraysRotinas[i][diasSemanas[k]]) {
                        let tipoRotina = dados_rotina[i].id_tipo
                        switch (tipoRotina) {
                            case 0:
                                cotaOnibus++
                                break;
                            case 1:
                                if (cotaTrilhoDesconto == false) {
                                    cotaTrilho++
                                    cotaTrilhoDesconto = true;
                                }
                                break;
                            case 2:
                                if (cotaTrilhoDesconto == false) {
                                    cotaTrilho += 1
                                    cotaOnibus += 1
                                    cotaTrilhoDesconto = true;
                                } else {
                                    cotaOnibus += 1
                                }
                                break;
                        }
                    }
                }
            }

            let cotaOnibusDiario = 0;
            let cotaTrilhoDiario = 0;

            for (let k = 0; k <= 6; k++) {
                let descontoDiario = false;
                for (let i = 0; i <= (dados_rotina.length - 1); i++) {
                    if (arraysRotinas[i][diasSemanas[k]]) {
                        let tipoRotina = dados_rotina[i].id_tipo
                        switch (tipoRotina) {
                            case 0:
                                if (descontoDiario == false) {
                                    cotaOnibusDiario++
                                    descontoDiario = true
                                    break;
                                }
                            case 1:
                                if (descontoDiario == false) {
                                    cotaTrilhoDiario++
                                    descontoDiario = true;
                                    break;
                                }

                            case 2:
                                if (descontoDiario == false) {
                                    cotaTrilhoDiario++
                                    cotaOnibusDiario++
                                    descontoDiario = true
                                    break;
                                }
                        }
                    }
                }
            }

            let valorSemanal = 0.00
            let valorSemanalEstudante = 0.00
            for (let i = 0; i <= (dados_rotina.length - 1); i++) {
                let ativos = 0;
                for (let k = 0; k <= 6; k++) {
                    if (arraysRotinas[i][diasSemanas[k]]) {
                        let tipoRotina = dados_rotina[i].id_tipo
                        if (dados_rotina[i]['rotina_desativada'] == true) {
                            valorSemanal = valorSemanal + 0.00
                        } else {
                            if (tipoRotina == 0 || tipoRotina == 1) {
                                valorSemanalEstudante = valorSemanalEstudante + 2.15
                                valorSemanal = valorSemanal + 4.30

                            } else {
                                valorSemanalEstudante = valorSemanalEstudante + 4.30
                                valorSemanal = valorSemanal + 7.48
                            }
                        }
                    }
                }
            }


            if (valorSemanal == 0.00) {
                return {
                    error: true,
                    message: 'Rotinas Desativadas'
                }
            } else {
                let valorDiario = valorSemanal / 7
                if (valorDiario < 4.30) {
                    valorDiario = 4.30
                }

                retornoVt = _this.previsaoValeTransporte(valorSemanal, saldo_vt)
                retornoVe = _this.previsaoEstudante(retornoVt, saldo_estudante, valorSemanalEstudante)
                retornoPl = _this.previsaoPasseLivre(retornoVt, cota_onibus, cota_trilho, cotaOnibus, cotaTrilho)

                if (isPasseLivre == true) {
                    retornoDiario = _this.previsaoDiario(retornoPl.onibus, cota_diaria_onibus, cota_diaria_trilho, cotaOnibusDiario, cotaTrilhoDiario)
                } else {
                    retornoDiario = _this.previsaoDiario(retornoVe, cota_diaria_onibus, cota_diaria_trilho, cotaOnibusDiario, cotaTrilhoDiario)
                }

                retornoVc = _this.previsaoComum(retornoDiario.onibus, saldo_comum, valorSemanal)
                let gastoDiario = (valorSemanal / 7).toFixed(2)
                let gastoSemanal = valorSemanal
                let gastoMensal = valorSemanal * 4

                if (saldo_vt < valorDiario) {
                    retornoVt = 'Seu saldo está abaixo do valor diário'
                }

                if (cota_onibus < cotaOnibus / 7 || cota_trilho < cotaTrilho / 7 || (cota_onibus <= 0 && cota_trilho <= 0)) {
                    retornoPl.onibus = 'Seu saldo está abaixo do valor diário'
                    retornoPl.trilho = 'Seu saldo está abaixo do valor diário'
                }

                if (saldo_estudante < valorDiario) {
                    retornoVe = 'Seu saldo está abaixo do valor diário'
                }

                data_push = retornoVc
                if (saldo_comum <= valorDiario) {
                    retornoVc = 'Seu saldo está abaixo do valor diário'
                    data_push = data
                }

                if (cota_diaria_onibus < cotaOnibusDiario / 7 || cota_diaria_trilho < cotaTrilhoDiario / 7) {
                    retornoDiario.onibus = 'Seu saldo está abaixo do valor diário'
                    retornoDiario.trilho = 'Seu saldo está abaixo do valor diário'
                }
                if (retornoVc != previsaoPush || previsaoPush == null || undefined) {

                    let newDate = data_push.split("/").reverse().join("-");
                    let payload = { 'data_duracao_credito': newDate }

                    _this.Previsao.update(payload, {
                        where: { id: BilheteID }
                    })
                        .then(function (sucess) {

                        }).catch(function (err) {
                        })
                }

                if (isPasseLivre == true) {
                    previsoes = {
                        "previsaoValeTransporte": retornoVt,
                        "previsaoPasseLivre": retornoPl,
                        "previsaoDiario": retornoDiario,
                        "previsaoComum": retornoVc,
                        "gastoDiario": gastoDiario,
                        "gastoSemanal": gastoSemanal,
                        "gastoMensal": gastoMensal
                    }
                    return previsoes
                } else {
                    previsoes = {
                        "previsaoValeTransporte": retornoVt,
                        "previsaoEstudante": retornoVe,
                        "previsaoDiario": retornoDiario,
                        "previsaoComum": retornoVc,
                        "gastoDiario": gastoDiario,
                        "gastoSemanal": gastoSemanal,
                        "gastoMensal": gastoMensal
                    }
                    return previsoes
                }
            }
        }).catch(function (err) {
            return errorResponse("Error" + err.message)
        })
    }


    previsaoValeTransporte(valorSemanal, saldo_vt) {
        duracaoSemanaVt = saldo_vt / valorSemanal
        if (duracaoSemanaVt != NaN || undefined || null) {
            let previsaoVt = moment().add(duracaoSemanaVt, 'weeks').format('DD/MM/YYYY')
            return previsaoVt
        } else {
            let previsaoVt = moment().add(dataInicio, 'weeks').format('DD/MM/YYYY')
            return previsaoVt
        }
    }

    previsaoEstudante(previsaoValeTransporte, saldo_estudante, valorSemanal) {
        duracaoSemanaVe = saldo_estudante / valorSemanal
        if (duracaoSemanaVe != null || undefined || NaN) {
            let previsaoVe = moment(previsaoValeTransporte, 'DD-MM-YYYY').add(duracaoSemanaVe, 'weeks').format('DD/MM/YYYY')
            return previsaoVe
        } else {
            let previsaoVe = previsaoValeTransporte
            return previsaoVe
        }
    }

    previsaoPasseLivre(previsaoValeTransporte, qtd_cota_onibus, qtd_cota_trilho, cotaOnibus, cotaTrilho) {
        if (cotaOnibus <= 0 || qtd_cota_onibus <= 0) {
            duracaoSemanaPasseLivreOnibus = 0
        } else {
            duracaoSemanaPasseLivreOnibus = qtd_cota_onibus / cotaOnibus
        }

        if (cotaTrilho <= 0 || qtd_cota_trilho <= 0) {
            duracaoSemanaPasseLivreTrilho = 0
        } else {
            duracaoSemanaPasseLivreTrilho = qtd_cota_trilho / cotaTrilho

        }
        if (duracaoSemanaPasseLivreOnibus != null || undefined) {
            let previsaoPlo = moment(previsaoValeTransporte, 'DD-MM-YYYY').add(duracaoSemanaPasseLivreOnibus, 'weeks').format('DD/MM/YYYY')
            let previsaoPlt = moment(previsaoValeTransporte, 'DD-MM-YYYY').add(duracaoSemanaPasseLivreTrilho, 'weeks').format('DD/MM/YYYY')

            return {
                onibus: previsaoPlo,
                trilho: previsaoPlt
            }

        } else {
            let previsaoPlo = previsaoValeTransporte
            return previsaoPlo
        }
    }

    previsaoComum(previsaoEstudante, saldo_comum, valorSemanal) {
        duracaoSemanaVc = saldo_comum / valorSemanal
        if (previsaoEstudante != null || undefined) {
            let previsaoVc = moment(previsaoEstudante, 'DD-MM-YYYY').add(duracaoSemanaVc, 'weeks').format('DD/MM/YYYY')
            return previsaoVc
        } else {
            let previsaoVe = moment(dataInicio, 'DD-MM-YYYY').add(duracaoSemanaVc, 'weeks').format('DD/MM/YYYY')
            return previsaoVe
        }
    }

    previsaoDiario(previsaoEstudante, qtd_cota_onibus_diaria, qtd_cota_trilho_diaria, cotaOnibusDiario, cotaTrilhoDiario) {
        if (cotaOnibusDiario <= 0 || qtd_cota_onibus_diaria <= 0) {
            duracaoSemanaOnibusDiario = 0
        } else {
            duracaoSemanaOnibusDiario = qtd_cota_onibus_diaria / cotaOnibusDiario
        }

        if (cotaTrilhoDiario <= 0 || qtd_cota_trilho_diaria <= 0) {
            duracaoSemanaTrilhoDiario = 0
        } else {
            duracaoSemanaTrilhoDiario = qtd_cota_trilho_diaria / cotaTrilhoDiario
        }

        if (duracaoSemanaOnibusDiario != null || undefined) {
            let previsaoDiarioOnibus = moment(previsaoEstudante, 'DD-MM-YYYY').add(duracaoSemanaOnibusDiario, 'weeks').format('DD/MM/YYYY')
            let previsaoDiarioTrilho = moment(previsaoEstudante, 'DD-MM-YYYY').add(duracaoSemanaTrilhoDiario, 'weeks').format('DD/MM/YYYY')
            return {
                onibus: previsaoDiarioOnibus,
                trilho: previsaoDiarioTrilho
            }
        } else {
            let previsaoDiario = previsaoEstudante
            return previsaoDiario
        }
    }

}

module.exports = PrevisaoController;