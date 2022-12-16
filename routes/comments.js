const express = require("express")
const Comments = require("../schemas/comment.js")

const router = express.Router();

const comment = [
    {
        user: "Developer",
        password: "1234",
        content: "안녕하세요 댓글입니다."
    }
]


//댓글 목록 조회
router.get("/comments/:_postId", (req, res) => {
    res.status(200).json({ data: comment })

})

//댓글 생성
router.post("/comments/:_postId", async (req, res) => {
    const { user, password, content } = req.body;

    const existsComments = await Comments.find({ user });
    if (existsComments.length) {
        return res.status(400).json({ success: false, errorMessage: "데이터 형식이 올바르지 않습니다." });
    }

    const createdcomment = await Comments.create({ user, password, content })

    res.json({ existsComments: createdcomment })
})

// 댓글 수정
router.put("/comments/:_commentId", async (req, res) => {
    const { user } = req.body;
    const { password } = req.body;
    const { content } = req.body;

    const existsComments = await Comments.find({ user });
    if (existsComments.length) {
        return res.status(400).json({ success: false, errorMessage: "댓글이 없습니다" })
    }
    if (Number(password) !== Number(existsCurds.password)) {
        return res.status(400).json({ success: false, errorMessage: "비밀번호가 틀립니다" })
    }
    await Posts.updateOne({ user }, { $set: { content } });
    res.json({ success: true })
})


// 댓글 삭제
router.delete("/comments/:_commentId", async (req, res) => {
    const { user } = req.body;
    const { password } = req.body;

    const existsComments = await Comments.find({ user });
    if (existsComments.length) {
        if (Number(password) === Number(existsComments.password)) {
            await Comments.deleteOne({ user });
        } else {
            return res.status(400).json({ success: false, errorMessage: "비밀번호가 다릅니다" })
        }
    }
    res.json({ result: "success" })
})

module.exports = router;