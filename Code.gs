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
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({status: "error", error: err.toString()}))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
