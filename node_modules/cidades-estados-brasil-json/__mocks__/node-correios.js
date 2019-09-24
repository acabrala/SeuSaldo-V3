export default class Correios
{
    constructor()
    {
        this.data = {
            30112021:
            {
                cep: '30112-021',
                logradouro: 'Avenida Getúlio Vargas',
                complemento: 'de 551/552 a 1219/1220',
                bairro: 'Savassi',
                localidade: 'Belo Horizonte',
                uf: 'MG',
                unidade: '',
                ibge: '3106200',
                gia: '',
            },
            '00000000':
            {
                erro: true,
            },
        };
    }

    consultaCEP(args, callback)
    {
        const { cep } = args;

        callback(null, this.data[cep]);
    }
}
