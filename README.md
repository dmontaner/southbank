# Southbank

A lightweight web questionnaire for the
**"Southbank Centre Creative Community Wellbeing Scale"**.

Live site: https://www.dmontaner.com/southbank/


## Set up for your own organization

### 1. Create a Google Sheet

Go to [Google Sheets](https://docs.google.com/spreadsheets/) and create a new blank spreadsheet.

### 2. Add the Apps Script backend

1. In your spreadsheet, go to **Extensions → Apps Script**.
2. Delete any existing code in the `Code.gs` editor.
3. Copy the contents of [Code.gs](https://raw.githubusercontent.com/dmontaner/southbank/refs/heads/main/Code.gs) and paste it in.
4. Save (Ctrl+S or the floppy-disk icon).

### 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set **Execute as:** Me (your Google account).
4. Set **Who has access:** Anyone.
5. Click **Deploy**.
6. Google will ask you to authorize the app:
   - Click **Authorize access**.
   - If you see *"Google hasn't verified this app"*, click **Advanced** → **Go to [project name] (unsafe)**.
   - Review the permissions and click **Allow**.
7. Copy the **Deployment ID** — it looks like:  
   `AKfycbxbYlGknELKkwceKtffzaMlPbWKK87uo4GMGwXZ9-2APVFL6rf2hB8dVIPoWeV-3UfcNg`


## Using the questionnaire

Share the URL with your **Deployment ID** as the `org` parameter:

```
https://www.dmontaner.com/southbank/?org=YOUR_DEPLOYMENT_ID
```

This is how the web site *knows* where to send the data.

You can also pre-fill the User ID by adding a `user` parameter:

```
https://www.dmontaner.com/southbank/?org=YOUR_DEPLOYMENT_ID&user=USER_ID
```

This may be important for authorization. See the "Restrict access" section below.

URL example without user id:  
https://www.dmontaner.com/southbank/?org=AKfycbxbYlGknELKkwceKtffzaMlPbWKK87uo4GMGwXZ9-2APVFL6rf2hB8dVIPoWeV-3UfcNg

URL example with user id:  
https://www.dmontaner.com/southbank/?org=AKfycbxbYlGknELKkwceKtffzaMlPbWKK87uo4GMGwXZ9-2APVFL6rf2hB8dVIPoWeV-3UfcNg&user=david

Responses are written to your Google Sheet automatically. Example sheet:  
 <https://docs.google.com/spreadsheets/d/1N--NwnBmUIDLhIJzZz0mZ5Px4mLBmW4TQXnPpB6hm38/edit?usp=sharing>


## Restrict access by user ID (Recommended)

Your Google Apps Script is **open** fro anyone with the **Deployment ID** to send data in.
This has undesirable potential effects in your data collection but more importantly may imply some security risks. 

You can allow only specific users to submit responses:

1. In your Google Sheet, create a second sheet named **`Users`**.
2. Add a column header **`UserId`** in cell A1.
3. List one allowed user ID per row below the header.

This will check that the userid is valid before letting the data be written to the spreadsheet.
You generate the user ids and keep them confidential. Just let the corresponding user know its own.
If you send the URL with the corresponding org and the user ids to each individual
the web page will populate the corresponding fields in the consent form.

**If no `Users` sheet exists, all user IDs are accepted.**
