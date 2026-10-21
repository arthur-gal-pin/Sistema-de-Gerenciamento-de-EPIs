import * as nodemailer from "nodemailer";
import EmailConfigs from "../configs/EmailConfigs";

class Mail {

    constructor(
        public destinatario?: string,
        public assunto?: string,
        public mensagem?: string) { }


    async sendMail(): Promise<void> {

        let mailOptions = {
            from: EmailConfigs.user,
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

        await transporter.sendMail(mailOptions);
    }
}

export default Mail;