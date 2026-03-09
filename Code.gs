function doGet(e) {
    // Responds to GET requests — used to warm up the script container
    // before the user submits, to avoid cold start delays.
    return ContentService.createTextOutput(JSON.stringify({status: "ok", message: "warm"}))
        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    try {
        const data = e.parameter; // Form data comes in as parameters, not postData
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
        const questionIds = [
            "consent_timestamp",
            "consent",
            "organizationId",
            "userId",
            "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"];

        // Add headers row if the sheet is empty
        if (sheet.getLastRow() === 0) {
            const headers = ["timestamp", ...questionIds];
            sheet.appendRow(headers);
        }

        const ts = new Date();
        const row = [ts];
        for (let id of questionIds) {
            row.push(data[id] || '');
        }
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({status: "ok"}))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({status: "error", error: err.toString()}))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
