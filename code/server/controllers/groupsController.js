const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const db = require('../../lib/db.js');



//http://localhost:3333/api/groups/register
exports.register = (req, res, next) => {
    db.query(
        `SELECT * FROM group_list WHERE LOWER(groupname) = LOWER(${db.escape(req.body.groupname)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'Dieser Gruppenname wird bereits verwendet!'
                });
            } else {
                db.query(
                    `INSERT INTO group_list (group_id, groupname, room_id) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.groupname
                )},  ${db.escape(req.body.room_id)})`,
                    (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                msg: err
                            });
                        }
                        return res.status(201).send({
                            msg: `${db.escape(req.body.groupname)} erfolgreich eingetragen.`
                        });
                    }
                );
            }
        });
}




//http://localhost:3333/api/groups/groupsList
exports.groupsList = (req, res, next) => {
    db.query(
        `SELECT * FROM group_list g LEFT JOIN rooms r ON g.room_id = r.room_id ORDER BY g.groupname;`, (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis gefunden!'
                });
            } else if (result) {
                return res.status(200).send({
                    group: result
                })
            }
        }
    )
}




//http://localhost:3333/api/groups/groupFind
exports.groupFind = (req, res, next) => {
    let searchTerm = req.body.textForSearch;
    db.query(
        `SELECT * FROM group_list WHERE groupname LIKE ?`, [`%` + `${searchTerm}` + `%`], (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis gefunden!'
                });
            } else if (result) {
                return res.status(200).send({
                    group: result
                })
            }
        }
    )
}



//http://localhost:3333/api/groups/editGroup
exports.editGroup = (req, res, next) => {
    db.query(
        `SELECT * FROM group_list WHERE group_id = ${db.escape(req.body.group_id)};`,
        (err, result) => {
            if (err) {
                throw err;
                res.send({
                    msg: err
                });
            } else if (result.length) {
                db.query(
                    `UPDATE group_list SET groupname = ${db.escape(
                    req.body.groupname
                    )}, room_id = ${db.escape(req.body.room_id)} WHERE group_id= ${db.escape(req.body.group_id)};`,
                    (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                msg: 'Update fehlgeschlagen.'
                            });
                        } else if (result) {
                            return res.status(200).send({
                                msg: `${db.escape(req.body.groupname)} wurde aktualisiert.`
                            })
                        }
                    }
                )
            }
        });
}




//http://localhost:3333/api/groups/deleteGroup
exports.deleteGroup = (req, res) => {
    try {
        db.query(`DELETE FROM group_list WHERE group_id= ${db.escape(req.body.group_id)};`)
        return res.status(200).send({
            msg: `${db.escape(req.body.groupname)} wurde gelöscht.`
        })
    } catch (err) {
        throw err;
        return res.status(400).send({
            msg: err
        })
    }
}