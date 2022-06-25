const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const db = require('../../lib/db.js');



//http://localhost:3333/api/rooms/register
exports.register = (req, res, next) => {
    db.query(
        `SELECT * FROM rooms WHERE LOWER(roomname) = LOWER(${db.escape(req.body.roomname)});`,
        (err, result) => {
            if (result.length) {
                return res.status(409).send({
                    msg: 'Dieser Raumname wird bereits verwendet!'
                });
            } else {
                db.query(
                    `INSERT INTO rooms (room_id, roomname) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.roomname
                )})`,
                    (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                msg: err
                            });
                        }
                        return res.status(201).send({
                            msg: `${db.escape(req.body.roomname)} eingetragen!`
                        });
                    }
                );
            }
        });
}



//http://localhost:3333/api/rooms/roomsList
exports.roomsList = (req, res, next) => {
    db.query(
        `SELECT * FROM rooms ORDER BY roomname;`, (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis gefunden.'
                });
            } else if (result) {
                return res.status(200).send({
                    room: result
                })
            }
        }
    )
}




//http://localhost:3333/api/rooms/roomFind
exports.roomFind = (req, res, next) => {
    let searchTerm = req.body.searchText;
    db.query(
        `SELECT * FROM rooms WHERE roomname LIKE ?;`, [`%` + searchTerm + `%`], (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis gefunden.'
                });
            } else if (result) {
                return res.status(200).send({
                    room: result
                })
            }
        }
    )
}



//http://localhost:3333/api/rooms/editRoom
exports.editRoom = (req, res, next) => {
    db.query(
        `SELECT * FROM rooms WHERE room_id = ${db.escape(req.body.room_id)};`,
        (err, result) => {
            if (err) {
                throw err;
                res.send({
                    msg: err
                });
            } else if (result.length) {
                db.query(
                    `UPDATE rooms SET roomname = ${db.escape(
                    req.body.roomname
                    )} WHERE room_id = ${db.escape(
                            req.body.room_id
                            )};`, (err, result) => {
                        if (err) {
                            throw err;
                            return res.status(400).send({
                                msg: 'Update fehlgeschlagen.'
                            });
                        } else if (result) {
                            return res.status(200).send({
                                msg: `${db.escape(req.body.roomname)} updated`,
                            })
                        }
                    }
                )
            }
        });
}




//http://localhost:3333/api/rooms/deleteRoom
exports.deleteRoom = (req, res) => {
    try {
        db.query(`DELETE FROM rooms WHERE room_id= ${db.escape(req.body.room_id)};`)
        return res.status(200).send({
            msg: `${db.escape(req.body.roomname)} wurde gelöscht.`
        })
    } catch (err) {
        throw err;
        return res.status(400).send({
            msg: err
        })
    }
}




//http://localhost:3333/api/rooms/trafficLightChange

exports.trafficLightChange = (req, res, next) => {
    db.query(`UPDATE rooms SET trafficLight = ${db.escape(req.body.trafficLight)} WHERE room_id = ${db.escape(req.body.room_id)};`
    , (err, result) => {
        if (err) {
            throw err;
            return res.status(400).send({
                msg: 'Update fehlgeschlagen.'
            });
        } else if (result) {
            return res.status(200).send({
                msg: `${db.escape(req.body.roomname)} updated`,
            })
        }
    }
)}




// 'http://localhost:3333/api/rooms/zustandChange'

exports.zustandChange = (req, res, next) => {
    db.query(`UPDATE rooms SET zustand = ${db.escape(req.body.zustand)} WHERE room_id = ${db.escape(req.body.room_id)};`
    , (err, result) => {
        if (err) {
            throw err;
            return res.status(400).send({
                msg: 'Update fehlgeschlagen.'
            });
        } else if (result) {
            return res.status(200).send({
                msg: `${db.escape(req.body.roomname)} updated`,
            })
        }
    }
)}
