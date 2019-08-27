let update;

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

class ViagemExtraController {

    constructor(ViagemExtra) {
        this.ViagemExtra = ViagemExtra;
    }

    viagemExtra(UserID, BilheteID, valor, quantidadeOnibus, quantidadeTrilho, quantidadeIntegracao, valorNegativo) {
        var response;
        let _this = this;
        let _viagemExtra = this.ViagemExtra;

        return this.ViagemExtra.find({
            where: { id_usuario: UserID, id: BilheteID }
        }).then(function (informacoes) {
            let saldoComum = informacoes.saldo_comum;
            let saldoVt = informacoes.saldo_vt;
            let saldoVe = informacoes.saldo_estudante;
            let passeLivreOnibus = informacoes.cota_onibus;
            let passeLivreTrilho = informacoes.cota_trilho;
            let cotaDiariaOnibus = informacoes.cota_diaria_onibus;
            let cotaDiariaTrilho = informacoes.cota_diaria_trilho;
            let flagBilheteUnico = informacoes.flag_bilhete_unico;
            let ultimaCarteira = informacoes.ultima_carteira;
            if(saldoVt == null || undefined ){
            	saldoVt = saldoVt
            }else {
            	saldoVt = parseFloat(saldoVt)
            }

            if(saldoVe == null || undefined){
            	saldoVe = saldoVe
            } else {
            	saldoVe = parseFloat(saldoVe)
            }

            if(saldoComum == null || undefined){
            	saldoComum = saldoComum
            } else {
            	saldoComum = parseFloat(saldoComum)

            }

            console.log(typeof(saldoComum))

            if (flagBilheteUnico === true) {
                var sp = principal(saldoVt, saldoVe, saldoComum, quantidadeOnibus, quantidadeTrilho, quantidadeIntegracao, ultimaCarteira, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho);
                if (sp.update === true) {
                    return _viagemExtra.update({ saldo_comum: sp.saldo_comum, saldo_vt: sp.saldo_vt, saldo_estudante: sp.saldo_ve, cota_onibus: sp.passe_livre_onibus, cota_trilho: sp.passe_livre_trilho, cota_diaria_onibus: sp.cota_onibus, cota_diaria_trilho: sp.cota_trilho }, {
                        where: { id: BilheteID }
                    }).then(function (resultSP) {
                        if (resultSP) {
                            response = {
                                error: false,
                                saldo_vt: sp.saldo_vt,
                                saldo_ve: sp.saldo_ve,
                                saldo_comum: sp.saldo_comum,
                                passe_livre_onibus: sp.passe_livre_onibus,
                                passe_livre_trilho: sp.passe_livre_trilho,
                                cota_diaria_onibus: sp.cota_onibus,
                                cota_diaria_trilho: sp.cota_trilho
                            }

                            return response;
                        }

                    }).catch(function (err) {

                        response = {
                            error: true,
                            message: "Erro: " + err
                        }

                        return response

                    })
                } else {

                    return {
                        "error": true,
                        "message": "Você não possui valor para realizar todos os descontos"
                    }
                }
                return sp
            } else {

                var outros = comum(saldoComum, valor, valorNegativo);

                console.log(outros)
                let saldocomum = outros.saldo_comum

                if (outros.update === true) {
                    return _viagemExtra.update({ saldo_comum: saldocomum }, {
                        where: { id: BilheteID }
                    }).then(function (result) {
                        if (result) {
                            response = {
                                error: false,
                                saldo_comum: saldocomum
                            }
                            return response
                        }
                    }).catch(function (err) {
                        response = {
                            error: true,
                            message: "Erro: " + err
                        }
                        return response

                    })
                } else {
                    return outros
                }
            }
        })
    }
}
function principal(saldoVt, saldoVe, saldoComum, quantidadeOnibus, quantidadeTrilho, quantidadeIntegracao, ultimaCarteira, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {
    
    console.log(saldoVt)
    if (quantidadeOnibus < 0) {
        var onibus = retirarSaldoOnibus(quantidadeOnibus, saldoVt, saldoVe, saldoComum, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho)
    } else {
        var onibus = adicionarSaldoOnibus(quantidadeOnibus, saldoVt, saldoVe, saldoComum, ultimaCarteira, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho)
    }
    if (quantidadeTrilho < 0) {
        var trilho = retirarSaldoTrilho(quantidadeTrilho, onibus.saldo_vt, onibus.saldo_ve, onibus.saldo_comum, onibus.passe_livre_onibus, onibus.passe_livre_trilho, onibus.diario_onibus, onibus.diario_trilho)
    } else {
        var trilho = adicionarSaldoTrilho(quantidadeTrilho, onibus.saldo_vt, onibus.saldo_ve, onibus.saldo_comum, ultimaCarteira, onibus.passe_livre_onibus, onibus.passe_livre_trilho, onibus.diario_onibus, onibus.diario_trilho)
    }
    if (quantidadeIntegracao < 0) {
        var integracao = retirarSaldoIntegracao(quantidadeIntegracao, trilho.saldo_vt, trilho.saldo_ve, trilho.saldo_comum, trilho.passe_livre_onibus, trilho.passe_livre_trilho, trilho.diario_onibus, trilho.diario_trilho)
    } else {
        var integracao = adicionarSaldoIntegracao(quantidadeIntegracao, trilho.saldo_vt, trilho.saldo_ve, trilho.saldo_comum, ultimaCarteira, trilho.passe_livre_onibus, trilho.passe_livre_trilho, trilho.diario_onibus, trilho.diario_trilho)
    }
    

    if (update === false) {
        return {
            error: true,
            message: "Você não possui valor para realizar todos os descontos",
            update: false
        }
    } else {

        return {
            update: true,
            saldo_vt: integracao.saldo_vt,
            saldo_ve: integracao.saldo_ve,
            saldo_comum: integracao.saldo_comum,
            passe_livre_onibus: integracao.passe_livre_onibus,
            passe_livre_trilho: integracao.passe_livre_trilho,
            cota_onibus: integracao.diario_onibus,
            cota_trilho: integracao.diario_trilho
        }

    }
}

function retirarSaldoOnibus(quantidadeOnibus, saldo_vt, saldo_ve, saldo_comum, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {
    if (quantidadeOnibus >= 0) {
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            cota_diaria_onibus: cotaDiariaOnibus,
            cota_diaria_trilho: cotaDiariaTrilho
        };

    } else {

        console.log(quantidadeOnibus  + saldo_vt)
        for (i = quantidadeOnibus; i < 0; i++) {
            if (saldo_vt >= 4.00) {
                saldo_vt -= 4
                update = true;
            } else if (passeLivreOnibus > 0) {
                passeLivreOnibus -= 1
                update = true;

            } else if (saldo_ve >= 2) {
                saldo_ve -= 2
                update = true

            } else if (cotaDiariaOnibus > 0) {
                cotaDiariaOnibus -= 1
                update = true;
            }

            else if (saldo_comum >= 4) {
                saldo_comum -= 4.00
                update = true;

            } else {
                update = false
                return {
                    error: true,
                    message: "Você não possui valor"
                }
            }

        }
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };

    }
}


function retirarSaldoTrilho(quantidadeTrilho, saldo_vt, saldo_ve, saldo_comum, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {
    if (quantidadeTrilho >= 0) {
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    } else {
        for (i = quantidadeTrilho; i < 0; i++) {
            if (saldo_vt >= 4.00) {
                saldo_vt -= 4.00
                update = true;
            } else if (passeLivreTrilho > 0) {
                passeLivreTrilho -= 1
                update = true;
            }
            else if (saldo_ve >= 2.00) {
                saldo_ve -= 2.00
                update = true;

            } else if (cotaDiariaTrilho > 0) {
                cotaDiariaTrilho -= 1
                update = true
            }

            else if (saldo_comum >= 4.00) {
                saldo_comum -= 4.00
                update = true;


            } else {
                update = false;

                return {
                    error: true,
                    message: "Você não possui valor"
                }
            }
        }
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    }
}


function retirarSaldoIntegracao(quantidadeIntegracao, saldo_vt, saldo_ve, saldo_comum, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {

    if (quantidadeIntegracao >= 0) {
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    } else {
        for (i = quantidadeIntegracao; i < 0; i++) {
            if (saldo_vt >= 6.96) {
                saldo_vt -= 6.96
                update = true;


            } else if (passeLivreOnibus && passeLivreTrilho > 0){
                passeLivreOnibus -= 1
                passeLivreTrilho -= 1
                update = true
            
            } else if (saldo_ve >= 4.00) {
                saldo_ve -= 4.00
                update = true;

            } else if (cotaDiariaOnibus && cotaDiariaTrilho > 0){
                cotaDiariaOnibus -= 1
                cotaDiariaTrilho -= 1
                update = true 

            }else if (saldo_comum >= 6.96) {
                saldo_comum -= 6.96
                update = true;

            } else {
                update = false;
                return {
                    error: true,
                    message: "Você não possui valor"
                }
            }
        }
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    }
}

function adicionarSaldoOnibus(quantidadeOnibus, saldo_vt, saldo_ve, saldo_comum, ultimaCarteira, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {
    if (quantidadeOnibus <= 0) {
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };

    } else {

        for (i = quantidadeOnibus; i > 0; i--) {
            if (ultimaCarteira == 1) {
                saldo_vt += 4
                update = true;

            } else if (ultimaCarteira == 2) {
                passeLivreOnibus += 1
                update = true

            } else if (ultimaCarteira == 3) {
                saldo_ve += 2
                update = true

            } else if (ultimaCarteira == 4) {
                cotaDiariaOnibus += 1
                update = true;
            } else if (ultimaCarteira == 5) {
                saldo_comum += 4.00
                update = true;
            } else if (ultimaCarteira == null){
            	saldo_comum += 4.00
            	update = true
            	console.log('************')
            	console.log(typeof(saldo_comum))

            }
                

            else {
                update = false

                return {
                    error: true,
                    message: "Você não possui valor"
                }
            }

        }
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };

    }
}


function adicionarSaldoTrilho(quantidadeTrilho, saldo_vt, saldo_ve, saldo_comum, ultimaCarteira, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {
    if (quantidadeTrilho <= 0) {
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    } else {
        for (i = quantidadeTrilho; i > 0; i--) {
            if (ultimaCarteira == 1) {
                saldo_vt += 4.00
                update = true;

            } else if(ultimaCarteira == 2) {
                passeLivreTrilho += 1
                update = true;

            }  else if (ultimaCarteira == 3) {
                saldo_ve += 2.00
                update = true;

            } else if (ultimaCarteira == 4) {
                cotaDiariaTrilho += 1
                update = true

            } else if (ultimaCarteira == 5) {
                saldo_comum += 4.00
                update = true;


            } else if (ultimaCarteira == null){
            	saldo_comum += 4.00
            	update = true

            } else {
                update = false;

                return {
                    error: true,
                    message: "Você não possui valor"
                }
            }
        }
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    }
}


function adicionarSaldoIntegracao(quantidadeIntegracao, saldo_vt, saldo_ve, saldo_comum, ultimaCarteira, passeLivreOnibus, passeLivreTrilho, cotaDiariaOnibus, cotaDiariaTrilho) {
    if (quantidadeIntegracao <= 0) {
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    } else {
        for (i = quantidadeIntegracao; i > 0; i--) {
            if (ultimaCarteira == 1) {
                saldo_vt += 6.96
                update = true;

            } else if (ultimaCarteira == 2) {
                passeLivreOnibus += 1
                passeLivreTrilho += 1
                update = true;

            } else if (ultimaCarteira == 3) {
                saldo_ve += 4.00
                update = true;

            } else if (ultimaCarteira == 4) {
                cotaDiariaOnibus += 1
                cotaDiariaTrilho += 1
                
            } else if(ultimaCarteira == 5){
                saldo_comum += 6.96
                update = true;
            } else if(ultimaCarteira == null){
            	 saldo_comum += 6.96
            	 update = true
            }
                else {
                update = false;

                return {
                    error: true,
                    message: "Você não possui valor"
                }
            }
        }
        return {
            saldo_vt: saldo_vt,
            saldo_ve: saldo_ve,
            saldo_comum: saldo_comum,
            passe_livre_onibus: passeLivreOnibus,
            passe_livre_trilho: passeLivreTrilho,
            diario_onibus: cotaDiariaOnibus,
            diario_trilho: cotaDiariaTrilho
        };
    }
}



function comum(saldo_comum, valor, valorNegativo) {



    if (valorNegativo == 1) {

        if (saldo_comum >= valor) {
            saldo_comum -= valor

            return {
                saldo_comum: saldo_comum,
                update: true
            }

        } else {
            return {
                error: true,
                message: "Você não possui saldo suficiente"
            }
        }
    } else {

        saldo_comum = saldo_comum + parseFloat(valor)

        return {
            saldo_comum: saldo_comum,
            update: true
        }
    }
}

module.exports = ViagemExtraController;
