const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const unirest = require('unirest');
app.use(cors());



// unirest.post(`https://andruxnet-random-famous-quotes.p.rapidapi.com/?count=1&cat=${row[2]}`)
//           .header("X-RapidAPI-Key", "5d54724286mshd1c147c47c2894fp1ee836jsn56baa3f725d7")
//           .header("Content-Type", "application/x-www-form-urlencoded")
//           .end(function (result) {
//             console.log(result.status, result.headers, result.body);
//           return result
//           })

app.get("/quotes", (req, res) => {
  // fetch("https://andruxnet-random-famous-quotes.p.rapidapi.com/?count=1&cat=famous", {
  //   headers: {
  //     "X-RapidAPI-Key": "5d54724286mshd1c147c47c2894fp1ee836jsn56baa3f725d7",
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   },
  //   method: "POST"  
  // })
  // .then(r => r.json())
  // .then(j=>{
  //   res.json(j)
  // })
})

getQuote = (data) => {
  return fetch(`https://andruxnet-random-famous-quotes.p.rapidapi.com/?count=1&cat=${data}`, {
    headers: {
      "X-RapidAPI-Key": "5d54724286mshd1c147c47c2894fp1ee836jsn56baa3f725d7",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  })
    .then(r => r.json())
    .then(j => {
      console.log(j);
      return j;
    })
}

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
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
    client_id,
    client_secret,
    redirect_uris[0]
  );

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
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1w1ZaPd43I67Npc9BEh2dk9IAtxSRQaCO44A79Zjj2Ac",
      range: "Sheet1"
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        console.log("Name, Major:");
        // Print columns A and E, which correspond to indices 0 and 4.
        const json = rows.map((row, i) => {
          console.log(`${row[0]}, ${row[1]}`);
          const obj = { name: row[0], pic: row[1] };
          getQuote(row[2]).then(r => {
            obj.quote = r[0].quote;
            console.log(obj.quote)
            if (i === rows.length - 1) {
              app.get("/api", (req, res) => {
                res.json(json);
              });
            }
          })
          return obj;
        });
      } else {
        console.log("No data found.");
      }
    }
  );
}
app.get;
const port = 3000;
app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});



