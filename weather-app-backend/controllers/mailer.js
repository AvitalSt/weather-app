const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

async function sendWeatherEmail(userEmail, city, weatherInfo) {
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: userEmail,
        subject: `Today's Weather in ${city}`,
        text: `Hi! The weather in ${city} today is: ${weatherInfo}. Enjoy your day! 😊`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { sendWeatherEmail };
