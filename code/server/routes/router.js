const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const db = require('../../lib/db.js');
const userMiddleware = require('../../middleware/users.js');

const SECRET_TOKEN = process.env.SECRET_TOKEN || 'SECRETKEY';


//-----------------------------------------------------------
// Users
//-----------------------------------------------------------
const userController = require('../controllers/userController')

router.post('/user/register', userMiddleware.validateRegister, userController.register);
router.post('/user/logout', userController.logout);
router.get('/user/userslist', userController.userlist);
router.post('/user/userfind', userController.userfind);
router.post('/user/editUser', userController.editUser);
router.get('/user/currentUser', userController.currentUser);
router.post('/user/deleteUser', userController.deleteUser);
router.post('/user/login', userController.login);




//-----------------------------------------------------------
// Children
//-----------------------------------------------------------
const childrenController = require('../controllers/childrenController')

router.post('/children/register', childrenController.register);
router.get('/children/childrenList', childrenController.childrenList);
router.post('/children/childrenFind', childrenController.childrenFind);
router.post('/children/editChildren', childrenController.editChildren);
router.post('/children/deleteChildren', childrenController.deleteChildren);



//-----------------------------------------------------------
// Educator
//-----------------------------------------------------------
const educatorController = require('../controllers/educatorController')

router.post('/educators/register', educatorController.register);
router.get('/educators/educatorlist', educatorController.educatorList);
router.post('/educators/educatorFind', educatorController.educatorFind);
router.post('/educators/editEducator', educatorController.editEducator);
router.post('/educators/deleteEducator', educatorController.deleteEducator);
router.post('/educators/saveDescription', educatorController.saveDescription);
router.get('/educators/educatorInLocationCunter', educatorController.educatorInLocationCunter);



// //-----------------------------------------------------------
// // Groups
// //-----------------------------------------------------------
const groupsController = require('../controllers/groupsController')

router.post('/groups/register', groupsController.register);
router.get('/groups/groupsList', groupsController.groupsList);
router.post('/groups/groupFind', groupsController.groupFind);
router.post('/groups/editGroup', groupsController.editGroup);
router.post('/groups/deleteGroup', groupsController.deleteGroup);





//-----------------------------------------------------------
// Rooms
//-----------------------------------------------------------
const roomsController = require('../controllers/roomsController')

router.post('/rooms/register', roomsController.register);
router.get('/rooms/roomsList', roomsController.roomsList);
router.post('/rooms/roomFind', roomsController.roomFind);
router.post('/rooms/editRoom', roomsController.editRoom);
router.post('/rooms/deleteRoom', roomsController.deleteRoom);
router.post('/rooms/trafficLightChange', roomsController.trafficLightChange);
router.post('/rooms/zustandChange', roomsController.zustandChange);




//-----------------------------------------------------------
// Absence
//-----------------------------------------------------------
const absenceController = require('../controllers/absenceController')

router.get('/absence/childrenlist', absenceController.childrenList);
router.post('/absence/childrenFind', absenceController.childrenFind);
router.post('/absence/enterChildren', absenceController.enterChildren);
router.post('/absence/exitChildren', absenceController.exitChildren);
router.post('/absence/saveDescription', absenceController.saveDescription);
router.post('/absence/childrenListOfGroups', absenceController.childrenListOfGroups);
router.get('/absence/presentChildrenList', absenceController.presentChildrenList);
router.get('/absence/absentChildrenList', absenceController.absentChildrenList);
router.post('/absence/searchForArchiv', absenceController.searchForArchiv);
router.get('/absence/chilrenInKindergartenCounter', absenceController.chilrenInKindergartenCounter);
router.get('/absence/beenPickedUpchilrenCounter', absenceController.beenPickedUpchilrenCounter);
router.get('/absence/occupiedRooms', absenceController.occupiedRooms);



//-----------------------------------------------------------
// location tracking
//-----------------------------------------------------------
const locationTrackingController = require('../controllers/locationTrackingController')

router.post('/locationTracking/childrenListInEachroom', locationTrackingController.childrenListInEachroom);
router.post('/locationTracking/addChildToRoom', locationTrackingController.addChildToRoom);
router.post('/locationTracking/educatorsForEachRoom', locationTrackingController.educatorsForEachRoom);
router.post('/locationTracking/setCurrentRoomForEducator', locationTrackingController.setCurrentRoomForEducator);







module.exports = router;