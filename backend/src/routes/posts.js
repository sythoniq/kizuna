const { Router } = require("express")
const posts = Router()
const controller = require("../controllers/postsController.js")
const auth = require("../utils/auth.js")
const validator = require("../utils/validator.js")

posts.get("/", controller.getAllPosts)

posts.post("/new", 
	validator.validatePost, validator.handleValidationError,
	auth.authorizeUser,
	controller.uploadPost
)

posts.get("/:postId", controller.getPost)
posts.get("/:postId/comments", controller.getPostComments)
posts.get("/:userId/posts", auth.authorizeUser, controller.getUserPosts)

posts.post("/:postId/like", auth.authorizeUser, controller.likePost)
posts.post("/:postId/comment", auth.authorizeUser, controller.uploadComment)

posts.delete("/:postId/delete", auth.authorizeUser, controller.deletePost)

module.exports = posts;
