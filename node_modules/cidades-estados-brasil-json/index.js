import Correios from 'node-correios';
import cities from './Cidades.json';
import states from './Estados.json';

function citiesBy(key, value)
{
    const entries = cities.filter(element => (element[key] === value));

    return entries;
}

function cityById(id)
{
    const [city] = citiesBy('ID', String(id));

    return city;
}

function stateBy(key, value)
{
    const entries = states.find(element => (element[key] === value));

    return entries;
}

function stateById(id)
{
    return stateBy('ID', String(id));
}

function cepWithPromise(value)
{
    return new Promise((resolve, reject) =>
    {
        const correios = new Correios();

        return correios.consultaCEP({ cep: value }, (err, result) =>
        {
            if (err) return reject(err);

            return resolve(result);
        });
    });
}

async function cep(value)
{
    const correctCEP = value.replace(/[^0-9]/g, '');
    const result = await cepWithPromise(correctCEP);

    if (result && !result.erro)
    {
        const [cidade] = citiesBy('Nome', result.localidade);

        result.cidade = cidade;
        result.estado = stateBy('Sigla', result.uf);

        return result;
    }

    return null;
}

export { cities, states, citiesBy, cityById, stateBy, stateById, cep };
