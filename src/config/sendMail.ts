import * as nodemailer from 'nodemailer';
import { OAuth2Client } from "google-auth-library";
import { InternalServerErrorException } from '@nestjs/common';

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `263515861393-h7fb0qu80ps4j33r33a7nfpckvh3pdvm.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04VH82simTc8nCgYIARAAGAQSNwF-L9IrNwX2t_35JsHUlgHn9iARMlFC2Wr92k1Q0PB4GD80hlMMT2RwegJxq6m8QWJi_uC77XE`;
const SENDER_MAIL = `katonnapro@gmail.com`;

// send mail
const sendEmail = async (to: string, url: string, txt: string) => {
    const oAuth2Client = new OAuth2Client(
        CLIENT_ID,
        CLIENT_SECRET,
        OAUTH_PLAYGROUND
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    try {
        const access_token = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: SENDER_MAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
            }
        })

        const mailOptions = {
            from: SENDER_MAIL,
            to: to,
            subject: "QTBlog",
            html: `
              <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
              <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DevAT channel.</h2>
              <p>Congratulations! You're almost set to start using BlogDEV.
                  Just click the button below to validate your email address.
              </p>
              
              <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
          
              <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          
              <div>${url}</div>
              </div>
            `,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw new InternalServerErrorException(error.message);
    }
};

export default sendEmail;