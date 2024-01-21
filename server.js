const express = require("express")
const { MongoClient } = require("mongodb")
const nodemailer = require("nodemailer");

const app = express()
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))

const uri = "mongodb+srv://Uszak:v7rUz2pCOHVeNXef@beatmarketplace.qmkvdj8.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let db = client.db("newsletters");

async function getMails(){
    let emailCollection = await db.collection('emails')
    let wyslane = await emailCollection.find()
    .project({ email: 1, _id: 0 })
    .toArray();
    const newMap = await wyslane.map((x) => {return x.email})
    return newMap;
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "u5569952@gmail.com",
      pass: "zotlurtmokxwroaz",
    },
});

app.get('/showmails', async (req, res) => {
    let emailCollection = await db.collection('emails')
    let wyslane = await emailCollection.find()
    .project({ email: 1, _id: 0 })
    .toArray();
    const newMap = await wyslane.map((x) => {return x.email})
    console.log(newMap);
})

app.get('/sendmail', async (req, res) => {
    const recivers = await getMails()
    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" u5569952@gmail.com', // sender address
        to: recivers, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    res.send("PRZESZLO!")
})

app.post('/savemail', async (req, res) => {
    let emailCollection = await db.collection('emails')
    let getEmailFromBody = req.body.email
    let wyslane = await emailCollection.insertOne({email: getEmailFromBody})
    res.status(200).send();
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(3000, () => {
    console.log("serwer stoi");
})