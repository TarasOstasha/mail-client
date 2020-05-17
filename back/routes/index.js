var express = require('express');
var router = express.Router();
var cors = require('cors');
var Base64 = require('js-base64').Base64;

// google gmail api
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
//api key - AIzaSyAkJJNH78Vyg4-QfDOqs5Gf9bDqvIR-5SE


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// let token = '???'
// const client_secret = 'NKEuIo31Z100qefkOhhJWWe_'
// const client_id = '935835049287-p5748ta7pceu0pt1j4tk0hd4qf5tpd6p.apps.googleusercontent.com';
// const redirect_uris = ['http://localhost:3000'];
// const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// getNewToken();
// // Check if we have previously stored a token.
// //oAuth2Client.setCredentials({ refresh_token: token });
// //callback(oAuth2Client);


// function getNewToken() {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       console.log(token, 'token!!!!!!!!!!!!!!!!!!!!!');
//       if (err) return console.error('Error retrieving access token', err);
//       router.get('/test', cors(), )
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile('TOKEN_PATH.json', JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       listLabels(oAuth2Client);
//     });
//   });
// }


// function listLabels(auth) {
//   const gmail = google.gmail({ version: 'v1', auth });
//   gmail.users.labels.list({
//     userId: 'me',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const labels = res.data.labels;
//     if (labels.length) {
//       console.log('Labels:');
//       labels.forEach((label) => {
//         console.log(`- ${label.name}`);
//       });
//     } else {
//       console.log('No labels found.');
//     }
//   });
// }


/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// [START gmail_quickstart]


// If modifying these scopes, delete token.json.
//const SCOPES = ['https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.labels'];
const SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send'
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    //grant_type: '',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
let gmail;
function listLabels(auth) {
  gmail = google.gmail({ version: 'v1', auth });
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
  //test(gmail);
}

//test
// function test(gmail) {
//   //console.log(JSON.stringify(gmail));
//   for(let key in gmail) { console.log(JSON.stringify(key) )};
//   runSample(gmail);
// }

async function runSample(to, msg, areaMsg) {
  //console.log(areaMsg, 'messageArea!!!!!!!!!!!!!')
  // Obtain user credentials to use for the request
  // const auth = await authenticate({
  //   keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
  //   scopes: [
  //     'https://mail.google.com/',
  //     'https://www.googleapis.com/auth/gmail.modify',
  //     'https://www.googleapis.com/auth/gmail.compose',
  //     'https://www.googleapis.com/auth/gmail.send',
  //   ],
  // });
  // google.options({auth});

  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  //const subject = '🤘 Hello 🤘';
  const subject = msg;
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  // const messageParts = [
  //   'From: Justin Beckwith <tonyjoss1990@gmail.com>',
  //   'To: Justin Beckwith <taras.ostasha@gmail.com>',
  //   'Content-Type: text/html; charset=utf-8',
  //   'MIME-Version: 1.0',
  //   `Subject: ${utf8Subject}`,
  //   '',
  //   'This is a message just to say hello.',
  //   'So... <b>Hello!</b>  🤘❤️😎',
  // ];
  
  const from = '<tonyjoss1990@gmail.com>';
  const messageParts = [
    `From: Taras Ostasha ${from}`, // email address
    `To: example <${to}>`, // delivery email name
    `Subject: ${utf8Subject}`, // subject
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    areaMsg // message in textarea

  ]
  const message = messageParts.join('\n');

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  }).catch(err => console.log(err));
  console.log(res);
  //return res.data;
  
}

// if (module === require.main) {
//   runSample().catch(console.error);
// }
// [END gmail_quickstart]



router.post('/msg', cors(), (req, res) => {
  try {
    console.log(req.body, 'this is request body!!!')
    const msg = req.body.subject;
    const to = req.body.to;
    const areaMsg = req.body.message;
    runSample(to, msg, areaMsg);
    res.json({ ok: true,  areaMsg});
  } catch (error) {
    console.log(error)
    res.json({ok: false})
  }

  //console.log(msg,to)

})

module.exports = router;
