const Sequelize = require('sequelize');
const Op = Sequelize.Op;
let moment = require('moment');
let dateFormat = require('date-format');

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

class ConsumoGraficoController {
    constructor(Consumo) {
        this.Consumo = Consumo;
    }

    getConsumo(userID, bilheteID, detalhesRotina, rotina, flagBilheteUnico, bilheteUnico) {

        let contador = 0;
        let _this = this;
        let response = { error: false };
        let segundaOnibus = [0]
        let tercaOnibus = [0]
        let quartaOnibus = [0]
        let quintaOnibus = [0]
        let sextaOnibus = [0]
        let sabadoOnibus = [0]
        let domingoOnibus = [0]
        let segundaTrilho = [0]
        let tercaTrilho = [0]
        let quartaTrilho = [0]
        let quintaTrilho = [0]
        let sextaTrilho = [0]
        let sabadoTrilho = [0]
        let domingoTrilho = [0]
        let segundaIntegracao = [0]
        let tercaIntegracao = [0]
        let quartaIntegracao = [0]
        let quintaIntegracao = [0]
        let sextaIntegracao = [0]
        let sabadoIntegracao = [0]
        let domingoIntegracao = [0]

        let totalSemanaIntegracao = 0.00
        let totalSemanaOnibus = 0.00
        let totalSemanaTrilho = 0.00
        let quantidadeDomingo = 0;
        let quantidadeSegunda = 0;
        let quantidadeTerca = 0;
        let quantidadeQuarta = 0;
        let quantidadeQuinta = 0;
        let quantidadeSexta = 0;
        let quantidadeSabado = 0;
        let valorDiarioOnibus = 0.00
        let valorDiarioTrilho = 0.00
        let valorDiarioIntegracao = 0.00
        let startOfMonth = moment().format('DD/MM/YYYY');
        let endOfMonth = moment().endOf('month').format('DD/MM/YYYY');
        let semanaOnibus = [domingoOnibus, segundaOnibus, tercaOnibus, quartaOnibus, quintaOnibus, sextaOnibus, sabadoOnibus]
        let semanaTrilho = [domingoTrilho, segundaTrilho, tercaTrilho, quartaTrilho, quintaTrilho, sextaTrilho, sabadoTrilho]
        let semanaIntegracao = [domingoIntegracao, segundaIntegracao, tercaIntegracao, quartaIntegracao, quintaIntegracao, sextaIntegracao, sabadoIntegracao]
        let dia = moment().isoWeekday()
        let valoresSp = [4.30, 4.30, 7.48]
        let valoresSpEstudante = [2.15, 2.15, 4.30];


        return bilheteUnico.findAll({
            include: [{
                model: detalhesRotina
            }, {
                model: rotina
            }],
            where: Sequelize.literal(`BilheteUnico.id = '${bilheteID}' And Rotinas.rotina_desativada = 0`)
        }).then(function (informacoes) {

            console.log(informacoes)

            let saldoComum = informacoes[0].dataValues.saldo_comum
            let saldoVT = informacoes[0].dataValues.saldo_vt
            let saldoEstudante = informacoes[0].dataValues.saldo_estudante
            let rotinas = informacoes[0].dataValues.Rotinas


            for (let i = 0; i < rotinas.length; i++) {
                console.log(i)
                for (let m = 0; m < 7; m++) {
                    let valor

                    if (flagBilheteUnico == 1) {
                        if (saldoVT == null || saldoVT < 4.30) {
                            valor = valoresSpEstudante
                            if (saldoEstudante == null || saldoEstudante < 2.15) {
                                valor = valoresSp
                            }
                        } else {
                            valor = valoresSp
                        }
                    } else {
                        valor = [rotinas[i].dataValues.valor, rotinas[i].dataValues.valor, rotinas[i].dataValues.valor]
                    }


                    if (informacoes[0].dataValues.DetalhesRotinas[m].dataValues.weekday != 0) {
                        if (rotinas[i].dataValues.id_tipo == 0) {

                            semanaOnibus[m].push(parseFloat(valor[0]))
                            totalSemanaOnibus = totalSemanaOnibus + parseFloat(valor[0])
                            if (informacoes[0].dataValues.DetalhesRotinas[m].dataValues.weekday == dia) {
                                valorDiarioOnibus = valorDiarioOnibus + parseFloat(valor[0])
                            }

                        } else if (rotinas[i].dataValues.id_tipo == 1) {
                            semanaTrilho[m].push(parseFloat(valor[1]))
                            totalSemanaTrilho = totalSemanaTrilho + parseFloat(valor[1])
                            if (informacoes[0].dataValues.DetalhesRotinas[m].dataValues.weekday == dia) {
                                valorDiarioTrilho = valorDiarioTrilho + parseFloat(valor[1])
                            }

                        } else if (rotinas[i].dataValues.id_tipo == 2) {
                            semanaIntegracao[m].push(parseFloat(valor[2]))
                            totalSemanaIntegracao = totalSemanaIntegracao + parseFloat(valor[2])
                            if (informacoes[0].dataValues.DetalhesRotinas[m].dataValues.weekday == dia) {
                                valorDiarioIntegracao = valorDiarioIntegracao + parseFloat(valor[2])
                            }

                        }
                    } else {
                        semanaOnibus[m].push(0.00)
                        semanaTrilho[m].push(0.00)
                        semanaIntegracao[m].push(0.00)
                    }
                }
            }


            while (startOfMonth <= endOfMonth) {

                let dataSplit = startOfMonth.split('/')
                let diaTeste = parseInt(dataSplit[0])
                let mesTeste = parseInt(dataSplit[1]) - 1
                let anoTeste = parseInt(dataSplit[2])
                var date = new Date(anoTeste, mesTeste, diaTeste)

                switch (date.getDay()) {
                    case 0:
                        quantidadeDomingo = quantidadeDomingo + 1

                        break
                    case 1:
                        quantidadeSegunda = quantidadeSegunda + 1

                        break
                    case 2:

                        quantidadeTerca = quantidadeTerca + 1

                        break
                    case 3:

                        quantidadeQuarta = quantidadeQuarta + 1

                        break
                    case 4:

                        quantidadeQuinta = quantidadeQuinta + 1

                        break
                    case 5:

                        quantidadeSexta = quantidadeSexta + 1

                        break
                    case 6:

                        quantidadeSabado = quantidadeSabado + 1

                        break
                }
                if (startOfMonth == endOfMonth) {
                    break;
                }

                startOfMonth = moment(startOfMonth, 'DD/MM/YYYY').add(1, 'days').format('DD/MM/YYYY');
            }


            let quantidadeSemana = [quantidadeDomingo, quantidadeSegunda, quantidadeTerca, quantidadeQuarta, quantidadeQuinta, quantidadeSexta, quantidadeSabado];
            let valorTotalMesIntegracao = 0.00
            let valorTotalMesOnibus = 0.00
            let valorTotalMesTrilho = 0.00
            for (let m = 0; m < semanaOnibus.length; m++) {
                let teste = semanaOnibus[m].reduce((total, next) => total = total + next) * quantidadeSemana[m]
                valorTotalMesOnibus = teste + valorTotalMesOnibus

            }
            for (let i = 0; i < semanaTrilho.length; i++) {
                let teste2 = semanaTrilho[i].reduce((total, next) => total = total + next) * quantidadeSemana[i]
                valorTotalMesTrilho = teste2 + valorTotalMesTrilho


            }
            for (let j = 0; j < semanaIntegracao.length; j++) {
                let teste3 = semanaIntegracao[j].reduce((total, next) => total = total + next) * quantidadeSemana[j]
                valorTotalMesIntegracao = teste3 + valorTotalMesIntegracao

            }

            let payload = {
                vou_gastar_dia_onibus: valorDiarioOnibus,
                vou_gastar_dia_trilho: valorDiarioTrilho,
                vou_gastar_dia_integracao: valorDiarioIntegracao,
                vou_gastar_semana_onibus: totalSemanaOnibus,
                vou_gastar_semana_trilho: totalSemanaTrilho,
                vou_gastar_semana_integracao: totalSemanaIntegracao,
                vou_gastar_mes_onibus: valorTotalMesOnibus,
                vou_gastar_mes_trilho: valorTotalMesTrilho,
                vou_gastar_mes_integracao: valorTotalMesIntegracao,
                id_bilhete: bilheteID,
                id_usuario: userID
            };
            console.log(payload)

            return _this.Consumo.find({
                where: {
                    id_bilhete: bilheteID
                }
            }).then(function (dados) {


                let gasteiDiaOnibus = 0.00
                let gasteiDiaTrilho = 0.00
                let gasteiDiaIntegracao = 0.00
                let gasteiSemanaOnibus = 0.00
                let gasteiSemanaTrilho = 0.00
                let gasteiSemanaIntegracao = 0.00
                let gasteiMesOnibus = 0.00
                let gasteiMesTrilho = 0.00
                let gasteiMesIntegracao = 0.00

                if (dados) {
                    _this.Consumo.update(payload, {
                        where:
                            { id_bilhete: bilheteID }
                    })



                    if (valorDiarioOnibus - dados.dataValues.ja_gastei_dia_onibus > 0.00) {
                        gasteiDiaOnibus = valorDiarioOnibus - dados.dataValues.ja_gastei_dia_onibus

                    }

                    if (valorDiarioTrilho - dados.dataValues.ja_gastei_dia_trilho > 0.00) {
                        gasteiDiaTrilho = valorDiarioTrilho - dados.dataValues.ja_gastei_dia_trilho

                    }

                    if (valorDiarioIntegracao - dados.dataValues.ja_gastei_dia_integracao > 0.00) {
                        gasteiDiaIntegracao = valorDiarioIntegracao - dados.dataValues.ja_gastei_dia_integracao
                    }



                    if (totalSemanaOnibus - dados.dataValues.ja_gastei_semana_onibus > 0.00) {
                        gasteiSemanaOnibus = totalSemanaOnibus - dados.dataValues.ja_gastei_semana_onibus
                    }

                    if (totalSemanaTrilho - dados.dataValues.ja_gastei_semana_trilho > 0.00) {
                        gasteiSemanaTrilho = totalSemanaTrilho - dados.dataValues.ja_gastei_semana_trilho

                    }

                    if (totalSemanaIntegracao - dados.dataValues.ja_gastei_semana_integracao > 0.00) {
                        gasteiSemanaIntegracao = totalSemanaIntegracao - dados.dataValues.ja_gastei_semana_integracao

                    }


                    if (valorTotalMesIntegracao - dados.dataValues.ja_gastei_mes_integracao > 0.00) {
                        gasteiMesIntegracao = valorTotalMesIntegracao - dados.dataValues.ja_gastei_mes_integracao
                    }

                    if (valorTotalMesTrilho - dados.dataValues.ja_gastei_mes_trilho > 0.00) {
                        gasteiMesTrilho = valorTotalMesTrilho - dados.dataValues.ja_gastei_mes_trilho
                    }

                    if (valorTotalMesOnibus - dados.dataValues.ja_gastei_mes_onibus > 0.00) {
                        gasteiMesOnibus = valorTotalMesOnibus - dados.dataValues.ja_gastei_mes_onibus
                    }

                    response = {
                        vou_gastar_dia: {
                            onibus: gasteiDiaOnibus,
                            trilho: gasteiDiaTrilho,
                            integracao: gasteiDiaIntegracao,
                        },
                        vou_gastar_semana: {
                            onibus: gasteiSemanaOnibus,
                            trilho: gasteiSemanaTrilho,
                            integracao: gasteiSemanaIntegracao,

                        },
                        vou_gastar_mes: {
                            onibus: gasteiMesOnibus,
                            trilho: gasteiMesTrilho,
                            integracao: gasteiMesIntegracao,

                        },
                        ja_gastei_dia: {
                            onibus: parseFloat(dados.dataValues.ja_gastei_dia_onibus),
                            trilho: parseFloat(dados.dataValues.ja_gastei_dia_trilho),
                            integracao: parseFloat(dados.dataValues.ja_gastei_dia_integracao),
                        },
                        ja_gastei_semana: {
                            onibus: parseFloat(dados.dataValues.ja_gastei_semana_onibus),
                            trilho: parseFloat(dados.dataValues.ja_gastei_semana_trilho),
                            integracao: parseFloat(dados.dataValues.ja_gastei_semana_integracao),
                        },
                        ja_gastei_mes: {
                            onibus: parseFloat(dados.dataValues.ja_gastei_mes_onibus),
                            trilho: parseFloat(dados.dataValues.ja_gastei_mes_trilho),
                            integracao: parseFloat(dados.dataValues.ja_gastei_mes_integracao),
                        },
                        id_bilhete: bilheteID,
                        id_usuario: userID,
                        error: false
                    };

                    console.log(response)

                    return response


                } else {

                    _this.Consumo.create(payload, {
                        where: { id_bilhete: bilheteID }
                    })

                    response = {
                        vou_gastar_dia: {
                            onibus: valorDiarioOnibus,
                            trilho: valorDiarioTrilho,
                            integracao: valorDiarioIntegracao,
                        },
                        vou_gastar_semana: {
                            onibus: totalSemanaOnibus,
                            trilho: totalSemanaTrilho,
                            integracao: totalSemanaIntegracao,

                        },
                        vou_gastar_mes: {
                            onibus: valorTotalMesOnibus,
                            trilho: valorTotalMesTrilho,
                            integracao: valorTotalMesIntegracao,

                        },
                        ja_gastei_dia: {
                            onibus: 0.00,
                            trilho: 0.00,
                            integracao: 0.00,
                        },
                        ja_gastei_semana: {
                            onibus: 0.00,
                            trilho: 0.00,
                            integracao: 0.00,
                        },
                        ja_gastei_mes: {
                            onibus: 0.00,
                            trilho: 0.00,
                            integracao: 0.00,
                        },
                        id_bilhete: bilheteID,
                        id_usuario: userID,
                        error: false
                    };

                }

                return response
            });


        }).catch(function (err) {
            console.log(err);
            return {
                error: true,
                message: "Tente novamente mais tarde"
            }

        })

    }
}



module.exports = ConsumoGraficoController;