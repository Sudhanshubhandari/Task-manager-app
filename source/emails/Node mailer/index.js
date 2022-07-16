var nodemailer = require('nodemailer');

function transporter() { 
  return nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sudhanshusb2@gmail.com',
    pass: 'kdznjnggnegztnci'
  }
})
};

// var mailOptions = {
//   from: 'sudhanshubhandari2@gmail.com',
//   to: 'mail4ashishbhandari@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });



function sendWelcomeEmail(email, name) {
  const transporterObject = transporter()
  transporterObject.sendMail({
      from: 'Task Manager API <sudhanshusb2.com>',
      to: email,
      subject: 'Thanks for joining!',
      text: `Welcome to our service, ${name}!`,
     
     
  })
}

function sendCancelationEmail(email, name) {
  const transporterObject = transporter()
  transporterObject.sendMail({
      from: 'Task Manager API <j****@gmail.com>',
      to: email,
      subject: 'We\'re sorry to see you leave',
      text: `We hope to see you back again someday, ${name}!`
  })
}

module.exports={
  sendWelcomeEmail,
  sendCancelationEmail
}
