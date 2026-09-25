// Configuration
const DATA_SHEET_NAME = "Sheet1";
const USERS_SHEET_NAME = "Users";
const USERS_ID_COLUMN = "UserId";

// Columns written to the data sheet, in order (after the leading "timestamp").
const QUESTION_IDS = [
    "consent_timestamp",
    "consent",
    "organizationId",
    "userId",
    "ageBand",
    "gender",
    "genderSelfDescription",
    "ethnicity",
    "participation",
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15"];

const HEADERS = ["timestamp", ...QUESTION_IDS];

/**
 * One-off setup. Run this manually from the Apps Script editor
 * (select "setup" in the function dropdown and click Run).
 *
 * It is safe to run more than once. It:
 *   - creates the data sheet if missing and writes the header row
 *   - appends any header that is missing (e.g. after new fields are added)
 *
 * Running it also triggers the one-time authorization the web app needs.
 * It does NOT create the "Users" sheet: see setupUsersSheet() below.
 */
function setup() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const log = [];

    let sheet = ss.getSheetByName(DATA_SHEET_NAME);
    if (!sheet) {
        sheet = ss.insertSheet(DATA_SHEET_NAME);
        log.push(`Created sheet "${DATA_SHEET_NAME}".`);
    }

    if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        log.push(`Wrote ${HEADERS.length} headers to "${DATA_SHEET_NAME}".`);
    } else {
        const existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
            .map(h => String(h).trim());
        const missing = HEADERS.filter(h => !existing.includes(h));
        if (missing.length > 0) {
            sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
            log.push(`Appended missing headers to "${DATA_SHEET_NAME}": ${missing.join(", ")}.`);
        } else {
            log.push(`Headers in "${DATA_SHEET_NAME}" already up to date.`);
        }
    }
    sheet.setFrozenRows(1);

    log.forEach(line => Logger.log(line));
    return log.join("\n");
}

/**
 * Optional: restrict submissions to a list of allowed user IDs.
 * Run this manually from the Apps Script editor, then list one allowed
 * user ID per row under the "UserId" header.
 *
 * WARNING: once the "Users" sheet exists, any user ID not listed in it is
 * rejected. An empty list blocks everyone. Delete the sheet to allow all.
 */
function setupUsersSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let usersSheet = ss.getSheetByName(USERS_SHEET_NAME);
    let msg;
    if (!usersSheet) {
        usersSheet = ss.insertSheet(USERS_SHEET_NAME);
        usersSheet.getRange(1, 1).setValue(USERS_ID_COLUMN);
        usersSheet.setFrozenRows(1);
        msg = `Created sheet "${USERS_SHEET_NAME}" with header "${USERS_ID_COLUMN}". Add one allowed user ID per row.`;
    } else {
        msg = `Sheet "${USERS_SHEET_NAME}" already exists.`;
    }
    Logger.log(msg);
    return msg;
}

function sanitize(value) {
    return String(value === null || value === undefined ? '' : value)
        .replace(/^[=+\-@|]/, '');
}

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
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({status: "error", error: `Sheet "${DATA_SHEET_NAME}" not found. Run setup() from the Apps Script editor.`}))
            .setMimeType(ContentService.MimeType.JSON);
        }

        // Add headers row if the sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(HEADERS);
        }

        // Write each value under its header, so older sheets whose columns are
        // in a different order (or missing some) still get the right data.
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
            .map(h => String(h).trim());
        const row = new Array(headers.length).fill('');
        const tsCol = headers.indexOf("timestamp");
        if (tsCol !== -1) row[tsCol] = new Date();
        for (let id of QUESTION_IDS) {
            const col = headers.indexOf(id);
            if (col !== -1) row[col] = sanitize(data[id] || '');
        }
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({status: "ok"}))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({status: "error", error: err.toString()}))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
