const express = require("express");
const router = express.Router();


const defaultController = require("../../Controller/defaultController");

router.get("/", defaultController);



module.exports = router;