const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env.js');


// send mail from testing account

const signup = async (req, res)=>{

    // testing acount
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let message = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Successfully Register with us.", // plain text body
        html: "<b>Successfully Register with us.</b>", // html body
    }

    transporter.sendMail(message).then((info) => {
        return res.status(201)
        .json({ 
            msg : "you should receive an email",
            info : info.messageId,
            preview : nodemailer.getTestMessageUrl(info)
        })

    }).catch(err =>{
        return res.status(500).json({error})
    })

    // res.status(201).json("signup successful")
}



// send mail from real gmail

const getbill = (req, res)=>{

    const { userEmail } = req.body;

    let config = {
        service : "gmail",
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new mailgen({
        theme: "default",
        product : {
            name : "Syamanthak",
            link : 'https://mailgen.js/'
        }
    })

    
    let response = {
        body : {
            name : " Daily Tuition",
            intro : "your bill has arrived!",
            table : {
                data : [
                    {
                        item : "JBL Tune 230NC TWS",
                        description : "Active Noise cancellation Earbuds with mic",
                        price : "$189.98"
                    }
                ]
            },
            outro : "Looking forward to do more business"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : userEmail,
        subject : "Place Order",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
        }).catch(error => {
            return res.status(500).json({ error })
    })

    // res.status(201).json("Get bill successfully")
}



module.exports = {
    signup,
    getbill
}