import { citiesBy, cityById, stateBy, stateById, cep } from './dist/index';

const MINAS_GERAIS = {
    ID: '11',
    Sigla: 'MG',
    Nome: 'Minas Gerais',
};
const BELO_HORIZONTE = {
    ID: '1630',
    Nome: 'Belo Horizonte',
    Estado: '11',
};
const SAVASSI = {
    bairro: 'Savassi',
    cep: '30112-021',
    cidade: BELO_HORIZONTE,
    complemento: 'de 551/552 a 1219/1220',
    estado: MINAS_GERAIS,
    gia: '',
    ibge: '3106200',
    localidade: 'Belo Horizonte',
    logradouro: 'Avenida Getúlio Vargas',
    uf: 'MG',
    unidade: '',
};

jest.mock('node-correios');

describe('citiesBy', () =>
{
    it('should return city', () =>
    {
        expect(citiesBy('Nome', 'Belo Horizonte')).toEqual([BELO_HORIZONTE]);
        expect(citiesBy('Nome', '')).toEqual([]);
    });

    it('should return cities for a state ID', () =>
    {
        expect(citiesBy('Estado', '22')).toEqual([
            { ID: '4398', Nome: 'Alto Alegre', Estado: '22' },
            { ID: '4399', Nome: 'Amajari', Estado: '22' },
            { ID: '4400', Nome: 'Boa Vista', Estado: '22' },
            { ID: '4401', Nome: 'Bonfim', Estado: '22' },
            { ID: '4402', Nome: 'Cantá', Estado: '22' },
            { ID: '4403', Nome: 'Caracaraí', Estado: '22' },
            { ID: '4404', Nome: 'Caroebe', Estado: '22' },
            { ID: '4405', Nome: 'Iracema', Estado: '22' },
            { ID: '4406', Nome: 'Mucajaí', Estado: '22' },
            { ID: '4407', Nome: 'Normandia', Estado: '22' },
            { ID: '4408', Nome: 'Pacaraima', Estado: '22' },
            { ID: '4409', Nome: 'Rorainópolis', Estado: '22' },
            { ID: '4410', Nome: 'São João da Baliza', Estado: '22' },
            { ID: '4411', Nome: 'São Luiz', Estado: '22' },
            { ID: '4412', Nome: 'Uiramutã', Estado: '22' },
        ]);
        expect(citiesBy('Estado', '99')).toEqual([]);
    });
});

describe('cityById', () =>
{
    it('should return city by ID field', () =>
    {
        expect(cityById(1630)).toEqual(BELO_HORIZONTE);
        expect(cityById(99999999)).toEqual(undefined);
    });
});

describe('stateBy', () =>
{
    it('should return state', () =>
    {
        expect(stateBy('Nome', 'Minas Gerais')).toEqual(MINAS_GERAIS);
        expect(stateBy('Sigla', 'MG')).toEqual(MINAS_GERAIS);
        expect(stateBy('Sigla', '')).toEqual(undefined);
    });
});

describe('stateById', () =>
{
    it('should return state by ID field', () =>
    {
        expect(stateById(11)).toEqual(MINAS_GERAIS);
        expect(stateById(9999)).toEqual(undefined);
    });
});

describe('cep', () =>
{
    it('should return CEP', async () =>
    {
        const cepBH = await cep('30112021');

        expect(cepBH).toEqual(SAVASSI);
    });

    it('should return CEP with dash and dot', async () =>
    {
        const cepBHwithDashAndDot = await cep('30.112-021');

        expect(cepBHwithDashAndDot).toEqual(SAVASSI);
    });

    it('should return null for wrong CEP', async () =>
    {
        const cepNull = await cep('00000000');

        expect(cepNull).toBe(null);
    });
});
