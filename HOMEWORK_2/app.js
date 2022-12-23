const express = require("express");
// const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")


// mongoose.set('strictQuery', true);
// mongoose.connect("mongodb://127.0.0.1/shopping-demo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));

const app = express();
const router = express.Router();


const { Op } = require("sequelize");
const { User } = require("./models");


// 회원가입 API mysql 
// app.js

router.post("/users", async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        res.status(400).send({
            errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
        });
        return;
    }

    // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findAll({
        where: {
            [Op.or]: [{ email }, { nickname }],
        },
    });
    if (existsUsers.length) {
        res.status(400).send({
            errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
        });
        return;
    }
    // 닉네임과 같은 값이 포함된 경우 회원가입에 실패
    const existsUsers2 = await User.findAll({
        where: {
            [Op.or]: [{ nickname }, { password }],
        },
    });
    if (existsUsers2.length) {
        res.status(400).send({
            errorMessage: "비밀번호 안에 닉네임을 포합하지마세요.",
        });
        return;
    }
    // 데이터베이스 내에 닉네임이 중복되지 않게 설정
    const existsUsers3 = await User.findAll({
        where: {
            [Op.or]: [{ nickname }],
        },
    });
    if (existsUsers3.length) {
        res.status(400).send({
            errorMessage: "중복되는 닉네임 입니다.",
        });
        return;
    }


    await User.create({ email, nickname, password });
    res.status(201).send({});
});
// 로그인 API mysql

router.post("/auth", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: {
            email,
        },
    });

    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || password !== user.password) {
        res.status(400).send({
            errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
        });
        return;
    }

    res.send({
        token: jwt.sign({ userId: user.userId }, "customized-secret-key"),
    });
});

// 사용자 인증 미들웨어 ?  authMiddleware - > res 
// 나의 정보 조회 API
const authMiddleware = require("./middlewares/auth-middleware.js")

router.get("/users/me", authMiddleware, async (req, res) => {
    res.json({ user: res.locals.user })
})



// 강의 숙련 3-2 10분 참조
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.static("assets"));// "assets"사용하기위한 미들웨어?

app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});