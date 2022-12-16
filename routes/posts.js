const express = require("express")
const Posts = require("../schemas/post.js")

const router = express.Router();

const post = [
    {
        user: "Developer",
        password: "1234",
        title: "안녕하세요",
        content: "안녕하세요 content 입니다."
    }
]

// 게시글 전체 조회
router.get("/posts", (req, res) => {
    res.status(200).json({ data: post })
})

// 게시글 상세 조회 
router.get("/posts/:_postId", (req, res) => {
    const { user } = req.params;
    const { detail } = Posts.filter((post) => post.user === user);
    res.json({ detail });
})


// 게시글 작성
router.post("/posts", async (req, res) => {
    const { user, password, title, content } = req.body;

    const existsCurds = await Posts.find({ user });
    if (existsCurds.length) {
        return res.status(400).json({ success: false, errorMessage: "데이터 형식이 올바르지 않습니다." });
    }


    const createdpost = await Posts.create({ user, password, title, content })

    res.json({ existsCurds: createdpost })
})

//게시글 수정  API

router.put("/posts/:_postId", async (req, res) => {
    const { title } = req.body;
    const { content } = req.body;
    const { password } = req.body;

    const existsCurds = await Posts.find({ title });
    if (existsCurds.length) {
        return res.status(400).json({ success: false, errorMessage: "게시물이없습니다" })
    }
    if (Number(password) !== Number(existsCurds.password)) {
        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀립니다" })
    }
    await Posts.updateOne({ title }, { $set: { content } });
    res.json({ success: true })
})

// 게시글 삭제 API
router.delete("/posts/:_postId", async (req, res) => {
    const { user } = req.body;
    const { password } = req.body;
    const existsCurds = await Posts.find({ user });
    if (existsCurds.length) {
        if (Number(password) === Number(existsCurds.password)) {
            await Posts.deleteOne({ user });
        } else {
            return res.status(400).json({ success: false, errorMessage: "비밀번호가 다릅니다" })
        }
    }
    res.json({ result: "success" })
})


module.exports = router;