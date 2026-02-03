import transporter from "../../../config/mail.config.js";

const sendMail = async ({ to, subject, htmlContent, textContent, cc }) => {
    // if(!to){
    //     throw new Error("EMAIL_NOT_PROVIDED");
    // }
    return transporter.sendMail({
        from: `"tkthive" <${process.env.MAIL_ADMINISTRATOR}>`,
        to,
        cc,
        subject,
        text: textContent,
        html: htmlContent,
    })
}

export default sendMail;
