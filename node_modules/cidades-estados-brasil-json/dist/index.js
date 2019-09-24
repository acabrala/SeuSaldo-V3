'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cep = exports.stateById = exports.stateBy = exports.cityById = exports.citiesBy = exports.states = exports.cities = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var cep = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value) {
        var correctCEP, result, _citiesBy3, _citiesBy4, cidade;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        correctCEP = value.replace(/[^0-9]/g, '');
                        _context.next = 3;
                        return cepWithPromise(correctCEP);

                    case 3:
                        result = _context.sent;

                        if (!(result && !result.erro)) {
                            _context.next = 9;
                            break;
                        }

                        _citiesBy3 = citiesBy('Nome', result.localidade), _citiesBy4 = _slicedToArray(_citiesBy3, 1), cidade = _citiesBy4[0];


                        result.cidade = cidade;
                        result.estado = stateBy('Sigla', result.uf);

                        return _context.abrupt('return', result);

                    case 9:
                        return _context.abrupt('return', null);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function cep(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _nodeCorreios = require('node-correios');

var _nodeCorreios2 = _interopRequireDefault(_nodeCorreios);

var _Cidades = require('./Cidades.json');

var _Cidades2 = _interopRequireDefault(_Cidades);

var _Estados = require('./Estados.json');

var _Estados2 = _interopRequireDefault(_Estados);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function citiesBy(key, value) {
    var entries = _Cidades2.default.filter(function (element) {
        return element[key] === value;
    });

    return entries;
}

function cityById(id) {
    var _citiesBy = citiesBy('ID', String(id)),
        _citiesBy2 = _slicedToArray(_citiesBy, 1),
        city = _citiesBy2[0];

    return city;
}

function stateBy(key, value) {
    var entries = _Estados2.default.find(function (element) {
        return element[key] === value;
    });

    return entries;
}

function stateById(id) {
    return stateBy('ID', String(id));
}

function cepWithPromise(value) {
    return new Promise(function (resolve, reject) {
        var correios = new _nodeCorreios2.default();

        return correios.consultaCEP({ cep: value }, function (err, result) {
            if (err) return reject(err);

            return resolve(result);
        });
    });
}

exports.cities = _Cidades2.default;
exports.states = _Estados2.default;
exports.citiesBy = citiesBy;
exports.cityById = cityById;
exports.stateBy = stateBy;
exports.stateById = stateById;
exports.cep = cep;