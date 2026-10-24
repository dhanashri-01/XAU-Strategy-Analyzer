const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

const {

    runStrategy,

    uploadCSV

} = require("../controllers/strategyController");

router.get("/", (req, res) => {

    res.send("Strategy API Working");

});

router.post(

    "/upload",

    upload.single("csv"),

    uploadCSV

);

router.post(

    "/run",

    verifyFirebaseToken,

    runStrategy

);

module.exports = router;
