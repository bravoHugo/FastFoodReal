const { Router } = require("express");
const router = Router();
const {
  checkNotAuthenticated,
} = require("../controllers/Users/Users.controllers.js");
const {
  Todashboard,
  Post_dashboard,
  Post_admin,
} = require("../controllers/Admin/Admin.controllers.js");
router.get("/user/adminPanel/Dashboard", Todashboard);
router.post("/user/adminPanel/Dashboard", Post_dashboard);
router.post("/user/adminPanel/register", Post_admin);
module.exports = router;
