# southbank

This repository implements a light web site to serve the
__"Southbank centre creative community wellbeing scale"__.


The web site can be seen at: 
https://www.dmontaner.com/southbank/


## Set up for your own organization:

1. Go to [Google Sheets](https://docs.google.com/spreadsheets/) and create a new blank spreadsheet.

1. Add the following column headers in the first row:

| timestamp | consent_timestamp | consent | organizationId | userId | q01 | q02 | q03 | q04 | q05 | q06 | q07 | q08 | q09 | q10 | q11 | q12 | q13 | q14 | q15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|


1. Then, in the top menu, go to `Extensions > Apps Scripts`.
1. Copy the code below in the __Code.gs__ editor (remove any prior code if it was in the editor).
1. Save the project to Drive (save icon).
1. Click the button `Deploy > New deployment`.


1. Go to the Select type > Web app
1. In the section __"Who has access"__ select "Anyone".
1. Click Deploy.

1. Then "The Web App requires you to authorize access to your data." > "Authorize access"

1. There will be a warning message: "Google hasn’t verified this app"
1. Follow the Advanced link (unsafe) and Continue the process

1. This will give you a "Deployment ID" that should look like:
   `AKfycbyRjQzoteVqKpPvXQzw6Ej2NGMWcoGynwUJ2A1ULlK5ySQdYaI5JfK9k4gDRCYyV2weOg`
   
1. Then you can use the page as  
   `https://www.dmontaner.com/southbank/?org=Deployment-ID`
   for instance  
   https://www.dmontaner.com/southbank/?org=AAKfycbyRjQzoteVqKpPvXQzw6Ej2NGMWcoGynwUJ2A1ULlK5ySQdYaI5JfK9k4gDRCYyV2weOg
   (new rows will be shown at:
   <https://docs.google.com/spreadsheets/d/1N--NwnBmUIDLhIJzZz0mZ5Px4mLBmW4TQXnPpB6hm38/edit?gid=0#gid=0>)



__Code.gs__


```
function doPost(e) {
    try {
        const data = e.parameter; // Form data comes in as parameters, not postData
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
        const ts = new Date();
        const row = [ts];
        const questionIds = [
            "consent_timestamp",
            "consent",
            "organizationId",
            "userId",
            "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"];
        for (let id of questionIds) {
            row.push(data[id] || '');
        }
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({status: "ok"}))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({status: "error", error: err.toString()}))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
```


Here's how to use this Google Apps Script with Google Sheets:

**1. Set up the Google Sheet:**
   - Open Google Sheets and create a new spreadsheet
   - Create a sheet named `"Responses"` (the script looks for this exact name)
   - Add column headers in the first row:
     - Column A: Timestamp
     - Column B: Consent
     - Column C: Consent Timestamp
     - Columns D-R: q01, q02, q03, ... q15

**2. Add the script to Google Sheets:**
   - In your Google Sheet, go to **Extensions → Apps Script**
   - Delete any default code and paste your script
   - Save it

**3. Deploy as a Web App:**
   - Click **Deploy** → **New deployment**
   - Select **Type: Web app**
   - Set **Execute as:** your Google account
   - Set **Who has access:** Anyone (or "Anyone with the link")
   - Click **Deploy**

HERE GOOGLE ASKS FOR AUTHORIZATION

   - Copy the deployment URL (looks like: `https://script.google.com/macros/s/AKfycbw7.../exec`)

   https://script.google.com/macros/s/AKfycbyyT38aR6S0JfMK24m64pJuYPca9WvVN9p1--NSCioCsU_CDQvKVaQgppHrS0Y4SQ0G/exec

**4. Use the URL in your questionnaire:**
   - Replace the `SCRIPT_URL` in your questionnaire.html with the deployment URL you just copied
   - When users submit, the POST request sends the JSON data to this URL
   - The script automatically parses it and appends a new row to your "Responses" sheet

**That's it!** Each submission will add a new row with all the response data.


User Journey 

1. index.html
1. questionnaire.html
1. extras.html
1. send.html
1. done.html
