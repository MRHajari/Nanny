const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const db = require('../../lib/db.js');



//http://localhost:3333/api/educators/register
exports.register = (req, res, next) => {
    db.query(
        `SELECT * FROM educator WHERE LOWER(firstname) = LOWER(${db.escape(req.body.firstname)})
         AND LOWER(lastname) = LOWER(${db.escape(req.body.lastname)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'Dieser Name wird bereits verwendet!'
                });
            } else {
                db.query(
                    `INSERT INTO educator (educator_id, firstname, lastname, registered) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.firstname
                )}, ${db.escape(req.body.lastname)}, now())`,
                    (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                msg: err
                            });
                        }
                        return res.status(201).send({
                            msg: `${db.escape(req.body.firstname)} ${db.escape(req.body.lastname)} schon Eingetragen`
                        });
                    }
                );
            }
        });
}







//http://localhost:3333/api/educators/educatorList
exports.educatorList = (req, res, next) => {
    db.query(
        `SELECT * FROM educator e ORDER BY e.firstname;`, (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis vorhanden.'
                });
            } else if (result) {
                return res.status(200).send({
                    educator: result
                })
            }
        }
    )
}




//http://localhost:3333/api/educators/educatorFind
exports.educatorFind = (req, res, next) => {
    let searchTerm = req.body.textForSearch;
    db.query(
        `SELECT * FROM educator WHERE firstname LIKE ? OR lastname LIKE ?;`, [`%` + searchTerm + `%`, `%` + searchTerm + `%`], (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis vorhanden.'
                });
            } else if (result) {
                return res.status(200).send({
                    educator: result
                })
            }
        }
    )
}



//http://localhost:3333/api/educators/editEducator
exports.editEducator = (req, res, next) => {
    db.query(
        `SELECT * FROM educator WHERE educator_id = ${db.escape(req.body.educator_id)};`,
        (err, result) => {
            if (err) {
                throw err;
                res.send({
                    msg: err
                });
            } else if (result.length) {
                db.query(
                    `UPDATE educator SET firstname = ${db.escape(
            req.body.firstname
            )} , lastname = ${db.escape(
                req.body.lastname
                )}  WHERE educator_id = ${db.escape(
                            req.body.educator_id
                            )};`, (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                msg: 'Update fehlgeschlagen'
                            });
                        } else if (result) {
                            return res.status(200).send({
                                msg: `${db.escape(req.body.firstname)} ${db.escape(req.body.lastname)} updated`
                            })
                        }
                    }
                )
            }
        });
}




//http://localhost:3333/api/educators/deleteEducator
exports.deleteEducator = (req, res) => {
    try {
        db.query(`DELETE FROM educator WHERE educator_id= ${db.escape(req.body.educator_id)};`)
        return res.status(200).send({
            msg: `${db.escape(req.body.firstname)} ${db.escape(req.body.firstname)} wurde gelöscht`
        })
    } catch (err) {
        throw err;
        return res.status(400).send({
            msg: err
        })
    }
}



function setDescription(description, educator_id) {
    return new Promise(resolve => {
        db.query(
            `UPDATE educator SET description = ${description} WHERE educator_id = ${educator_id};`,
            (err, result) => {
                if (err) {
                    throw err;
                    return res.status(400).send({
                        msg: 'Text nicht gespeichert'
                    });
                } else if (result) {
                    return resolve(result);
                }
            })
    })
}


// 'http://localhost:3333/api/educator/saveDescription'
exports.saveDescription = (req, res, next) => {
    educator_id = db.escape(req.body.educator_id)
    description = db.escape(req.body.description)
    setDescription(description, educator_id)
        .then((result) => {
            return res.status(200).send({
                msg: 'Beschreibung gespeichert'
            })
        })
}



//http://localhost:3333/api/educators/educatorInLocationCunter
exports.educatorInLocationCunter = (req, res, next) => {
    db.query(
        `SELECT * FROM educator e WHERE e.current_room IS NOT NULL;`, (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis vorhanden.'
                });
            } else if (result) {
                return res.status(200).send({
                    educator: result
                })
            }
        }
    )
}