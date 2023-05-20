import express from "express";
import controller from "../controllers/Blog";
import { upload } from "../middleware/multerStorage";
import verifyToken from "../middleware/jwtVerify";

const router = express.Router({ mergeParams: true });

router.post(
	"/create",
	verifyToken,
	upload.single("content"),
	controller.createPost
);
router.get("/all", verifyToken, controller.getPosts);
router.delete("/:post_id", verifyToken, controller.deletePostById);
router.put(
	"/update/:post_id",
	verifyToken,
	upload.single("content"),
	controller.updatePostById
);

export default router;
