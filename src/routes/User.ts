import express from "express";
import controller from "../controllers/User";

const router = express.Router({ mergeParams: true });

router.post("/signup", controller.userSignUp);
router.post("/login", controller.loginUser);

export = router;
