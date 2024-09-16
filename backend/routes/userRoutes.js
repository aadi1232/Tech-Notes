const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct

router.route('/')
    .get(userController.getAllusers)
    .post(userController.CreateNewusers)
    .patch(userController.Updateusers)
    .delete(userController.Deleteusers);

module.exports = router;
