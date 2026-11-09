const prisma = require("../utils/prisma.js")

async function getPostById(postId) {
	try {
		const post = await prisma.posts.findUnique({
			where: {
				post_id: Number(postId)
			}
		});

		if (!post) {
			return null;
		}

		return { success: true, post};
	}	catch(err) {
		return { success: false, message: err }
	}
}

async function getAllPosts(req, res, next) {
	try {
		const posts = await prisma.posts.findMany({})

		return res.status(200).json({ success: true, posts})
	}	catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function getPost(req, res, next) {
	try {
		const result = await getPostById(req.params.postId)

		if (!result) {
			return res.status(404).json({ success: false, message: "Post not found!" })
		}

		if (!result.success) {
			throw new Error(result.message)
		}

		return res.status(200).json({ success: true, post: result.post})
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function getUserPosts(req, res, next) {
	try {
		const userPosts = await prisma.posts.findMany({
			where: {
				author_id: Number(req.user.user_id)
			}
		})

		if (!userPosts || userPosts.length <= 0) {
			return res.status(404).json({ success: false, message: "No posts found!"})
		}

		return res.status(200).json({ success: true, userPosts})
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err})
	}
}

async function getPostComments(req, res, next) {
	try {
		const postComments = await prisma.comments.findMany({
			where: {
				post_id: Number(req.params.postId)
			}
		})

		if (!postComments || postComments.length <= 0) {
			return res.status(404).json({ success: false, message: "No comments found!" })
		}

		return res.status(200).json({ success: true, postComments })
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err})
	}
} 

async function uploadPost(req, res, next) {
	try {
		const newPost = await prisma.posts.create({
			data: {
				post_content: req.body.postContent,
				author_id: Number(req.user.user_id)
			}
		})

		return res.status(200).json({ success: true, message: "Post uploaded!", newPost})
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err})
	}
}

async function likePost(req, res, next) {
	try {
		const result = await getPostById(req.params.postId)
		if (!result) {
			return res.status(404).json({ success: false, message: "Post not found!" })
		}

		if (!result.success) {
			throw new Error(result.message)
		}

		await prisma.posts.update({
			where: { post_id: Number(req.params.postId) },
			data: { post_likes: { increment: 1 } }
		})

		return res.status(200).json({ success: true, message: "Post liked!"})
	} catch(err) {
		console.log(err)
		return res.status(500).json({ success: false, message: "Server error", err})
	}
}

async function uploadComment(req, res, next) {
	try {
		const newComment = await prisma.comments.create({
			data: {
				comment_body: req.body.commentContent,
				author_id: Number(req.user.user_id),
				post_id: Number(req.params.postId)
			}
		})

		return res.status(200).json({ success: true, message: "Comment uploaded!", newComment })
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function deletePost(req, res, next) {
	try {
		const result = await getPostById(req.params.postId)
		if (!result) {
			return res.status(404).json({ success: false, message: "Post not found!" })
		}

		if (!result.success) {
			throw new Error(err)	
		}

		if (req.user.user_id != result.post.author_id) {
			return res.status(401).json({ success: false, message: "Unauthorized!" })
		}

		await prisma.posts.delete({
			where: {
				post_id: Number(req.params.postId)
			}	
		})

		return res.status(200).json({ success: true, message: "Post deleted"})
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err})
	}
}

module.exports = {
	getAllPosts,
	getPost,
	getUserPosts,
	uploadPost,
	getPostComments,
	uploadComment,
	deletePost,
	likePost
}
