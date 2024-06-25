

import { Resend } from 'resend';

const resend = new Resend('re_Ak7n8cE8_EvLbxvDfX74j9Qdmnzw19A5m');



export default async function handler(req, res) {
    if (req.method == "POST") {
        const { email, subject, message } = req.body;

        try {
            await  resend.emails.send({
                from: 'treasures.onboard@gmail.com',
                to: email,
                subject: subject,
                html: message,
            });
            res.status(200).json({message: "Email sent successfully"});
        } catch (error) {
            res.status(500).json({ error: "Error sending email" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}