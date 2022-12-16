const express = require('express');
const app = express();
const port = 3000;

const postRouter = require("./routes/posts.js")
const commentRouter = require("./routes/comments.js")
const connect = require("./schemas")
connect()

app.use(express.json());
app.use("/api", [postRouter, commentRouter]);


app.get('/', (req, res) => {
    res.send('Node.js와 express로 로그인 기능이 없는 나만의 항해 블로그 백엔드 서버 만들기!');
});


// 전체 조회 API
app.get('/posts', (req, res) => {
    res.json();
})

app.post("/", (req, res) => {
    console.log(req.body);

    res.send("기본 URI에 POST 메소드가 정상적으로 실행되었습니다.")
})

// ?? 
app.get("/", (req, res) => {
    console.log(req.query);

    const obj = {
        "keykey": "value입니다",
        "이릅입니다": "이름일까요?",
    }

    res.json();
})

app.get(":/_postId", (req, res) => {
    console.log(req.params);

    res.send(":id URI에 정상적으로 반환되었습니다");
})

app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
});