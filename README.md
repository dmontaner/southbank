# Southbank

A lightweight web questionnaire form for the
**"Southbank Centre Creative Community Wellbeing Scale"**.

## Set up for your own organization

### 1. Create a Google Sheet

Go to [Google Sheets](https://docs.google.com/spreadsheets/) and create a new blank spreadsheet.

### 2. Add the Apps Script backend

1. In your spreadsheet, go to **Extensions → Apps Script**.
2. Delete any existing code in the `Code.gs` editor.
3. Copy the contents of [Code.gs](https://raw.githubusercontent.com/dmontaner/southbank/refs/heads/main/Code.gs) and paste it in.
4. Save (Ctrl+S or the floppy-disk icon <img src="images/icon_save.svg" alt="Save icon" height="18" style="vertical-align: text-bottom;">).

### 3. Run the setup function

1. In the toolbar, open the function dropdown (next to the **Run** button) and select **`setup`**.
2. Click **Run**.
3. The first time, Google will ask you to authorize the script:
   - Click **Review permissions** and choose your Google account.
   - If you see *"Google hasn't verified this app"*, click **Advanced** → **Go to [project name] (unsafe)**.
   - Click **Allow**.
4. Check the **Execution log** at the bottom of the editor. It tells you what was done.

The setup function writes the column headers to your sheet (the first tab, named `Sheet1`).
It is safe to run more than once: if headers already exist it only appends the missing ones,
so run it again whenever you update `Code.gs` with new fields.

**What happens if you skip this step?**

- On a new spreadsheet, the headers are written automatically with the first submission, so nothing is lost.
- On a spreadsheet that already has responses from an older version, submissions still work but
  any **new** fields are silently dropped until you run `setup`.
- If your first tab is not named `Sheet1`, submissions fail with an error until you either rename
  the tab or run `setup`.

### 4. Deploy as a Web App

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
   `AKfycbwg4U0CnSi4z28vIuK7QHaE5Yn4UePwTPxui7Xhoyay7IbhOiI7jhGT7QHby6gg__TB6A`


## Using the questionnaire

Share the URL with your **Deployment ID** as the `org` parameter:

```
https://ccws-southbank.web.app/?org=YOUR_DEPLOYMENT_ID
```

This is how the web site *knows* where to send the data.

You can also pre-fill the User ID by adding a `user` parameter:

```
https://ccws-southbank.web.app/?org=YOUR_DEPLOYMENT_ID&user=USER_ID
```

This may be important for authorization. See the **Restrict access** section below.

URL example without user id:  
https://ccws-southbank.web.app/?org=AKfycbwg4U0CnSi4z28vIuK7QHaE5Yn4UePwTPxui7Xhoyay7IbhOiI7jhGT7QHby6gg__TB6A

URL example with user id:  
https://ccws-southbank.web.app/?org=AKfycbwg4U0CnSi4z28vIuK7QHaE5Yn4UePwTPxui7Xhoyay7IbhOiI7jhGT7QHby6gg__TB6A&user=david

Responses are written to your Google Sheet automatically. Example sheet:  
 <https://docs.google.com/spreadsheets/d/1CrtZclmA2KvcSuCTcPp-aWo5cyTB367OF3j7DZQwkTM/edit?usp=sharing>


## Restrict access by user ID (Recommended)

Your Google Apps Script is **open** for anyone with the **Deployment ID** to send data in.
This can corrupt your data collection and may pose security risks. 

You can allow only specific users to submit responses:

1. In your Google Sheet, create a second sheet named **`Users`**.
2. Add a column header **`UserId`** in cell A1.
3. List one allowed user ID per row below the header.

Steps 1 and 2 can also be done for you: in the Apps Script editor select **`setupUsersSheet`**
in the function dropdown and click **Run**.

This validates the user ID before writing data to the spreadsheet.
Generate the user IDs yourself and share each one only with the corresponding participant.
When you include both `org` and `user` in the URL, the consent form fields are pre-filled automatically.

**If no `Users` sheet exists, all user IDs are accepted.**  
**If the `Users` sheet exists but is empty, nobody is accepted**, so add the IDs right after creating it.
