import express from "express";
import controller from "../controllers/Blog";
import verifyToken from "../middleware/jwtVerify";

const router = express.Router({ mergeParams: true });

router.post("/create", verifyToken, controller.createPost);
router.get("/all", verifyToken, controller.getPosts);
router.delete("/:post_id", verifyToken, controller.deletePostById);
router.put("/update/:post_id", verifyToken, controller.updatePostById);




export default router;
