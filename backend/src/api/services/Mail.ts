import * as nodemailer from "nodemailer";
import EmailConfigs from "../configs/EmailConfigs";

class Mail {

    constructor(
        public destinatario?: string,
        public assunto?: string,
        public mensagem?: string) { }


    sendMail() {

        let mailOptions = {
            from: "portalband@band.com.br", //adicionar email particular
            to: this.destinatario,
            subject: this.assunto,
            html: this.mensagem
        };

        const transporter = nodemailer.createTransport({
            host: EmailConfigs.host,
            port: EmailConfigs.port,
            secure: false,
            auth: {
                user: EmailConfigs.user,
                pass: EmailConfigs.password
            },
            tls: { rejectUnauthorized: false }
        });


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return error;
            } else {
                return "E-mail enviado com sucesso!";
            }
        });
    }
}

export default Mail;