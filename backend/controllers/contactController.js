// import { sendMailContactUs } from "../utils/sendEmail";
const { sendMailContactUs } = require('../utils/sendEmail')


const sendContactMail = async (req, res) => {

    const { name, email, MessageData } = req.body;
    console.log(req.body)
    if (!name || !email || !MessageData) {
        res.status(400)
        throw new Error("Please fill all the fields");
    }
    try {
        await sendMailContactUs(email, name, MessageData)
        res.status(200).send("message sended successfully")
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error")
    }
}

module.exports = {
    sendContactMail
}