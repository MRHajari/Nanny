const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const db = require('../../lib/db.js');


//http://localhost:3333/api/children/register
exports.register = (req, res, next) => {
    db.query(
        `SELECT * FROM children WHERE LOWER(firstname) = LOWER(${db.escape(req.body.firstname)})
     AND LOWER(lastname) = LOWER(${db.escape(req.body.lastname)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'Dieser Name wird bereits verwendet!'
                });
            } else {
                db.query(
                    `INSERT INTO children (id, firstname, lastname, kind, registered, group_id) VALUES ('${uuid.v4()}', ${db.escape(
            req.body.firstname
            )}, ${db.escape(req.body.lastname)}, ${db.escape(req.body.kind)}, now(), ${db.escape(req.body.group_id)})`,
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



//http://localhost:3333/api/children/childrenlist
exports.childrenList = (req, res, next) => {
    db.query(
        `SELECT * FROM children c LEFT JOIN group_list g ON c.group_id = g.group_id ORDER BY c.firstname;`, (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    child: result
                })
            }
        }
    )
}




//http://localhost:3333/api/children/childrenFind
exports.childrenFind = (req, res, next) => {
    let searchTerm = req.body.textForSearch;
    db.query(
        `SELECT * FROM children WHERE firstname LIKE ? OR lastname LIKE ?;`, [`%` + searchTerm + `%`, `%` + searchTerm + `%`], (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    child: result
                })
            }
        }
    )
}




//http://localhost:3333/api/children/editChildren
exports.editChildren = (req, res, next) => {
    db.query(
        `SELECT * FROM children WHERE id = ${db.escape(req.body.id)};`,
        (err, result) => {
            if (err) {
                throw err;
                res.send({
                    msg: err
                });
            } else if (result.length) {
                db.query(
                    `UPDATE children SET firstname = ${db.escape(
            req.body.firstname
            )}, lastname = ${db.escape(
                req.body.lastname
                )}, kind = ${db.escape(
                        req.body.kind
                        )}, group_id = ${db.escape(
                            req.body.group_id
                            )}  WHERE id = ${db.escape(
                                req.body.id
                                )};`,
                    (err, result) => {
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





//http://localhost:3333/api/children/deleteChildren
exports.deleteChildren = (req, res) => {
    try {
        db.query(`DELETE FROM children WHERE id= ${db.escape(req.body.id)};`)
        return res.status(200).send({
            msg: `${db.escape(req.body.firstname)} ${db.escape(req.body.firstname)} wurde gelöscht.`
        })
    } catch (err) {
        throw err;
        return res.status(400).send({
            msg: err
        })
    }
}