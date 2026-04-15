const { Router } = require("express");
const { toNodeHandler } = require("better-auth/node");
const auth = require("../lib/auth");

const router = Router();

router.all("/*", toNodeHandler(auth));

module.exports = router;
