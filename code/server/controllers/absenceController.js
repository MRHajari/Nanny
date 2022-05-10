const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const moment = require('moment');

const db = require('../../lib/db.js');


function getCurrentDate() {
    return moment().format('YYYY-MM-DD')
}


let idTemp = ''

function createChildrenList() {
    return new Promise(resolve => {
        db.query(
            `SELECT * FROM children;`, (err, result) => {
                if (err) {
                    throw err;
                } else if (result) {
                    for (let i = 0; i < result.length; i++) {
                        idTemp = result[i]
                        db.query(
                            `INSERT INTO absence (absence_id, day, children_id) VALUE ('${uuid.v4()}', '${moment().format('YYYY-MM-DD')}' , '${idTemp.id}');`, () => {
                                resolve();
                            })

                    }
                }

            })
    })
}





function checkIfListIsUpToDateIfNotCreateNew() {
    return new Promise(resolve => {
        db.query(
            `SELECT day FROM absence WHERE day = '${getCurrentDate()}';`,
            (err, result) => {
                if (err) {
                    throw err;
                } else if (!result[0]) {
                    createChildrenList().then(() => resolve());
                } else {
                    resolve();
                }
            }
        )
    })
}



function getChildrenAbsenceList() {
    return new Promise(resolve => {
        db.query(
            `SELECT * FROM absence a LEFT JOIN children c ON a.children_id = c.id where day = '${getCurrentDate()}' ORDER BY c.firstname;`,
            (err, result) => {
                if (err) {
                    throw err;
                    return res.status(400).send({
                        msg: 'Kein Ergebnis'
                    });
                } else if (result) {
                    resolve(result);
                }
            }
        )
    })
}





//http://localhost:3333/api/absence/childrenlist
exports.childrenList = (req, res, next) => {
    checkIfListIsUpToDateIfNotCreateNew()
        .then(getChildrenAbsenceList)
        .then((childrenList) => {
            return res.status(200).send({
                child: childrenList
            })
        })
}




//http://localhost:3333/api/absence/presentChildrenList
exports.presentChildrenList = (req, res, next) => {
    db.query(
        `SELECT * FROM absence a LEFT JOIN children c ON a.children_id = c.id WHERE day = '${getCurrentDate()}' AND a.enter_child IS NOT NULL ORDER BY c.firstname;`,
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




//http://localhost:3333/api/absence/absentChildrenList
exports.absentChildrenList = (req, res, next) => {
    db.query(
        `SELECT * FROM absence a LEFT JOIN children c ON a.children_id = c.id WHERE day = '${getCurrentDate()}' AND a.exit_child IS NOT NULL ORDER BY c.firstname;`,
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




//http://localhost:3333/api/absence/childrenListOfGroups
exports.childrenListOfGroups = (req, res, next) => {
    db.query(
        `SELECT * FROM absence a LEFT JOIN children c ON a.children_id = c.id LEFT JOIN group_list g ON c.group_id = g.group_id WHERE day = '${getCurrentDate()}' AND g.groupname = ${db.escape(req.body.groupname)}  ORDER BY c.firstname;`,
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





const insertCurrentRoom = (absence_id) => {
    db.query(
        `SELECT r.roomname
        FROM absence a 
        LEFT JOIN children c ON a.children_id = c.id 
        LEFT JOIN group_list g ON c.group_id = g.group_id
        LEFT JOIN rooms r ON g.room_id = r.room_id 
        WHERE a.absence_id = ${absence_id};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                db.query(
                    `UPDATE absence SET current_room = '${result[0].roomname}' WHERE absence_id = ${absence_id};`,
                    (err, result) => {
                        if (err) {
                            throw err;
                        } else if (result) {
                            let msg = 'Aktuelle Uhrzeit eingetragen '
                            return msg
                        }
                    }
                )
            }
        })
}



//http://localhost:3333/api/absence/enterChildren
exports.enterChildren = (req, res, next) => {
    let absence_id = db.escape(req.body.absence_id);
    db.query(
        `UPDATE absence SET enter_child = now() WHERE absence_id = ${absence_id};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                insertCurrentRoom(absence_id)
                return res.status(200).send({
                    msg: 'Eingecheckt'
                })
            }
        }
    )
}



const deleteCurrentRoom = (absence_id) => {
    db.query(
        `UPDATE absence SET current_room = NULL WHERE absence_id = ${absence_id};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                let msg = 'Aktuelle Uhrzeit wurde gelöscht'
                return msg
            }
        }
    )

}


//http://localhost:3333/absence/exitChildren
exports.exitChildren = (req, res, next) => {
    let absence_id = db.escape(req.body.absence_id);
    db.query(
        `UPDATE absence SET exit_child = now() WHERE absence_id = ${absence_id};`,
        (err, result) => {
            if (err) {
                throw err;
            } else if (result) {
                deleteCurrentRoom(absence_id)
                return res.status(200).send({
                    msg: 'Ausgecheckt'
                })
            }
        }
    )
}




function setDescription(description, absence_id) {
    return new Promise(resolve => {
        db.query(
            `UPDATE absence SET description = ${description} WHERE absence_id = ${absence_id};`,
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



// http://localhost:3333/api/absence/saveDescription
exports.saveDescription = (req, res, next) => {
    absence_id = db.escape(req.body.absence_id)
    description = db.escape(req.body.description)
    setDescription(description, absence_id)
        .then((result) => {
            return res.status(200).send({
                msg: 'Beschreibung gespeichert'
            })
        })
}





//http://localhost:3333/api/absence/childrenFind
exports.childrenFind = (req, res, next) => {
    let searchTerm = req.body.textForSearch;
    db.query(
        `SELECT * FROM  absence a LEFT JOIN children c ON a.children_id = c.id WHERE (c.firstname LIKE ? OR c.lastname LIKE ?) AND day = '${getCurrentDate()}' ORDER BY c.firstname;`, [`%` + searchTerm + `%`, `%` + searchTerm + `%`], (err, result) => {
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




//http://localhost:3333/api/absence/searchForArchiv
exports.searchForArchiv = (req, res, next) => {

    try {
        let firstname = req.body.firstname
        let lastname = req.body.lastname
        let groupname = req.body.groupname
        let fromDate = req.body.fromDate
        let toDate = req.body.toDate
        let sqlStatement = 'SELECT * FROM  absence a LEFT JOIN children c ON a.children_id = c.id LEFT JOIN group_list g ON c.group_id = g.group_id WHERE '

        if (firstname) {
            sqlStatement += ` c.firstname ='${firstname}' AND `
        }
        if (lastname) {
            sqlStatement += ` c.lastname ='${lastname}' AND `
        }
        if (groupname) {
            sqlStatement += ` g.groupname ='${groupname}' AND `
        }
        if (fromDate && fromDate <= toDate) {
            sqlStatement += `  (a.day >= '${fromDate}' AND a.day <= '${toDate}') ORDER BY c.firstname;`
        } else {
            sqlStatement += ` a.day = '${toDate}' ORDER BY c.firstname;`
        }


        db.query(
            sqlStatement,
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
            }
        )

    } catch (err) {
        throw err;
        return res.status(400).send({
            msg: 'Kein Ergebnis'
        });
    }


}




//http://localhost:3333/api/absence/chilrenInKindergartenCounter
exports.chilrenInKindergartenCounter = (req, res, next) => {
    db.query(
        `SELECT * FROM  absence WHERE enter_child IS NOT NULL AND day = '${getCurrentDate()}'`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    childrenAbsenceCunter: result
                })
            }
        }
    )
}





//http://localhost:3333/api/absence/beenPickedUpchilrenCounter
exports.beenPickedUpchilrenCounter = (req, res, next) => {
    db.query(
        `SELECT * FROM  absence WHERE exit_child IS NOT NULL AND day = '${getCurrentDate()}'`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    childrenpickedUPCunter: result
                })
            }
        }
    )
}



//http://localhost:3333/api/absence/occupiedRooms
exports.occupiedRooms = (req, res, next) => {
    db.query(
        `SELECT current_room FROM absence a WHERE a.current_room IS NOT NULL AND day = '${getCurrentDate()}' GROUP BY a.current_room ORDER BY a.current_room;`,
        (err, result) => {
            if (err) {
                throw err;
                return res.status(400).send({
                    msg: 'Kein Ergebnis'
                });
            } else if (result) {
                return res.status(200).send({
                    occupiedRoom: result
                })
            }
        }
    )
}
