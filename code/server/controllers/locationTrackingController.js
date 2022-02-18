const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const moment = require('moment');

const db = require('../../lib/db.js');


function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
}




//http://localhost:3333/api/locationTracking/childrenListInEachroom
exports.childrenListInEachroom = (req, res, next) => {
    db.query(
        `SELECT * FROM absence a LEFT JOIN children c ON a.children_id = c.id LEFT JOIN group_list g ON c.group_id = g.group_id LEFT JOIN rooms r ON g.room_id = r.room_id WHERE day = '${getCurrentDate()}' AND a.current_room = ${db.escape(req.body.roomname)} ORDER BY c.firstname;`,
        (err, result) => {
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
        })
}




// http://localhost:3333/api/locationTracking/addChildToRoom
exports.addChildToRoom = (req, res, next) => {
    db.query(
        `UPDATE absence a SET a.current_room = ${db.escape(req.body.roomname)} WHERE a.absence_id = ${db.escape(req.body.absence_id)};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                return res.status(200).send({
                    msg: 'Kind im Zimmer hinzugefügt'
                })
            }
        }
    )
}



// http://localhost:3333/locationTracking/educatorsForEachRoom
exports.educatorsForEachRoom = (req, res, next) => {
    db.query(
        `SELECT * FROM educator e WHERE e.current_room = ${db.escape(req.body.roomname)};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                return res.status(200).send({
                    educator: result
                })
            }
        }
    )
}


// http://localhost:3333/api/locationTracking/setCurrentRoomForEducator
exports.setCurrentRoomForEducator = (req, res, next) => {
    db.query(
        `UPDATE educator e SET e.current_room = ${db.escape(req.body.roomname)} WHERE e.educator_id = ${db.escape(req.body.educator_id)};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                return res.status(200).send({
                    msg: 'Erzhier/in im Zimmer hinzugefügt'
                })
            }
        }
    )
}