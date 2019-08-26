const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MKTz@zz1",
    database: "consultai_dev"
});

connection.connect()

connection.query("SELECT valor_volta,hora_volta, domingo, segunda, terca, quarta, quinta, sexta, sabado, flag_volta, id_tipoVolta, rotina_desativada_volta, usuario_id, bilhete_unico.id FROM consultai_dev.rotina inner join consultai_dev.bilhete_unico " +
    "on consultai_dev.rotina.usuario_id = bilhete_unico.id_usuario " +
    "where rotina.id between 1 and 16500 and hora_volta is not null and id_tipoVolta is not null", function (error, results, fields) {
        if (error) throw error;
        console.log(results.length)

        for (let j = 0; j < results.length; j++) {

            let diasWeekday = {
                domingo: results[j].domingo,
                segunda: results[j].segunda,
                terca: results[j].terca,
                quarta: results[j].quarta,
                quinta: results[j].quinta,
                sexta: results[j].sexta,
                sabado: results[j].sabado
            };
            let diasRotinaUsuario = [];

            if (diasWeekday.domingo == 1) {
                diasRotinaUsuario.push(7)
            } else {
                diasRotinaUsuario.push(0)

            }
            if (diasWeekday.segunda == 1) {
                diasRotinaUsuario.push(1)

            } else {
                diasRotinaUsuario.push(0)

            }
            if (diasWeekday.terca == 1) {
                diasRotinaUsuario.push(2)
            } else {
                diasRotinaUsuario.push(0)
            }
            if (diasWeekday.quarta == 1) {
                diasRotinaUsuario.push(3)
            } else {
                diasRotinaUsuario.push(0)
            }
            if (diasWeekday.quinta == 1) {
                diasRotinaUsuario.push(4)
            } else {
                diasRotinaUsuario.push(0)

            }
            if (diasWeekday.sexta == 1) {
                diasRotinaUsuario.push(5)
            } else {
                diasRotinaUsuario.push(0)
            }
            if (diasWeekday.sabado == 1) {
                diasRotinaUsuario.push(6)

            } else {
                diasRotinaUsuario.push(0)

            }

            // console.log(results)


            let payload = {
                horario: results[j].hora_ida,
                valor: results[j].valor_ida,
                flag: results[j].flag_ida,
                id_tipo: results[j].id_tipoIda,
                rotina_desativada: results[j].rotina_desativada_ida,
                id_bilhete: results[j].id,
                usuario_id: results[j].usuario_id,
                nome_rotina: 'v2'
            }




            connection.query("insert into seusaldo_v2.rotina set ? ", payload, function (err, results, fields) {
                if (results) {

                    // console.log(fields)
                    for (let i = 0; i <= diasRotinaUsuario.length - 1; i++) {
                        let response = {
                            weekday: diasRotinaUsuario[i],
                            id_rotina: results.insertId,
                            id_bilhete: payload.id_bilhete

                        }

                        connection.query("insert into seusaldo_v2.detalhes_rotina set ?", response, function (err, fields) {
                            if (fields) {
                                console.log(fields)
                            } else {
                                console.log(err)
                                return
                            }
                        })
                    }

                } else {
                    return;

                }
            })

        }
    }
);



