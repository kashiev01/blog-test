import express from "express";
import controller from "../controllers/User";

const router = express.Router({ mergeParams: true });

router.post("/signup", controller.createUser);
router.post("/login", controller.loginUser);


export = router;
