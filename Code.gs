// Configuration
const DATA_SHEET_NAME = "Sheet1";
const USERS_SHEET_NAME = "Users";
const USERS_ID_COLUMN = "UserId";

function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({status: "ok", message: "warm"}))
        .setMimeType(ContentService.MimeType.JSON);
}

function checkUserAuthorization(userId) {
    // Returns null if the user is authorized, or an error message string if not.

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const usersSheet = ss.getSheetByName(USERS_SHEET_NAME);

    if (!usersSheet) return null;

    const headers = usersSheet.getRange(1, 1, 1, usersSheet.getLastColumn()).getValues()[0];
    const colIndex = headers.indexOf(USERS_ID_COLUMN);
    if (colIndex === -1) return `Configuration error: column "${USERS_ID_COLUMN}" not found in the "${USERS_SHEET_NAME}" sheet.`;

    const lastRow = usersSheet.getLastRow();
    if (lastRow < 2) return `User "${userId}" is not authorized.`;

    const userIds = usersSheet
        .getRange(2, colIndex + 1, lastRow - 1, 1)
        .getValues()
        .flat()
        .map(id => String(id).trim())
        .filter(id => id !== '');

    if (userIds.includes(String(userId).trim())) return null;

    return `User "${userId}" is not authorized.`;
}

function doPost(e) {
    try {
        const data = e.parameter; // Form data comes in as parameters, not postData

        const submittedUserId = (data.userId || '').trim();
        if (!submittedUserId) {
            return ContentService.createTextOutput(JSON.stringify({status: "error", error: "No User ID was provided."}))
            .setMimeType(ContentService.MimeType.JSON);
        }
        const authError = checkUserAuthorization(submittedUserId);
        if (authError) {
            return ContentService.createTextOutput(JSON.stringify({status: "error", error: authError}))
            .setMimeType(ContentService.MimeType.JSON);
        }

        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_SHEET_NAME);
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
