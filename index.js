const express = require("express")
const body_parser = require("body-parser")
const axios = require("axios")
const { PythonShell } = require('python-shell');

require('dotenv').config();

const app = express().use(body_parser.json());
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

app.listen(process.env.PORT, () => {
    console.log("webhook is listening")
});

app.get("/", (req, res) => {
    res.status(200).send("Hello ! This is GAC webhook setup !")
});

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge =req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];


    if (mode && token) {
        if (mode === "subscribe" && token===mytoken) {
            res.status(200).send(challenge);
        }
        else {
            res.status(403);
        }
    }
});

app.post("/webhook", (req, res) => {

    let body_p = req.body;

    console.log(JSON.stringify(body_p, null, 2));

    if (body_p.object) {
        if (body_p.entry &&
            body_p.entry[0].changes &&
            body_p.entry[0].changes[0].value.messages &&
            body_p.entry[0].changes[0].value.messages[0]) {

            let type = body_p.entry[0].changes[0].value.messages[0].type;
            let phone_number_id = body_p.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_p.entry[0].changes[0].value.messages[0].from;

            let message = '';

            if (type === "text") {

                let body = body_p.entry[0].changes[0].value.messages[0].text.body;

                /*if (!customers.has(from)) {*/

                    console.log("Received message from " + from + ": \n" + body);
                    /*customers.add(from);*/

/*                    axios({
                        method: "post",
                        url: "https://graph.facebook.com/v17.0/" + phone_number_id + "/messages?access_token=" + token,
                        data: {
                            messaging_product: "whatsapp",
                            to: from,
                            text: {
                                body: "Greetings from GAC ! You will be assisted shortly."
                            }

                        },
                        headers: {
                            content_type: "application/json"
                        }
                    });*/

                    message = from + " : " + body;


                /*}*/
                /*else {*/

/*                    console.log("Received message from " + from + " -> \n" + body);
                    message = "Message from " + from + ":" + body;*/

                /*}*/

            }

            else if (type === "document") {

                let mt = body_p.entry[0].changes[0].value.messages[0].document.mime_type;
                let id = body_p.entry[0].changes[0].value.messages[0].document.id;
                let filename = body_p.entry[0].changes[0].value.messages[0].document.filename;

                console.log("mime_type -> " + mt);
                console.log("id -> " + id);
                console.log("filename -> " + filename);

                if (mt === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    message = "download " + id + " " + from + " " + filename;
                    message = from + " : " + "download " + id + " " + filename;
                }
                
            }

            else {

            }

             if (message !== '') {

                // Send message to skype receivers !!
                 console.log('Sending Message -> ' + message + ' \nto skype receivers.');
                let options = {
                    mode: 'text',
                    pythonPath: 'python', // Replace with the path to your Python interpreter if needed
                    pythonOptions: ['-u'], // get print results in real-time
                    scriptPath: './',
                    args: [message]
                };

                PythonShell.run('send_skype_message.py', options, (err, results) => {
                    if (err) throw err;

                    console.log('Message -> ' + message + ' \nsent to skype receivers successfully!');

                });
            } 

            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    }

});
