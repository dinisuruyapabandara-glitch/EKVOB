// Google Apps Script for EKVOBA Old Boys Registration
// 1. Open Google Sheets (https://sheets.google.com) and create a new spreadsheet.
// 2. Click Extensions -> Apps Script.
// 3. Delete any existing code and paste this entire script.
// 4. Click Deploy -> New deployment -> Select type: "Web app".
//    - Execute as: Me
//    - Who has access: Anyone
// 5. Copy the Web App URL and paste it into GOOGLE_SCRIPT_URL in index.html (and ekvoba_official_website.html).

const NOTIFICATION_EMAIL = "ekvoba@gmail.com";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Years Attended",
        "Phone Number",
        "Email Address",
        "Current Profession"
      ]);
    }

    const timestamp = data.timestamp || new Date().toISOString();

    // 1. Save registration data to Google Sheet
    sheet.appendRow([
      timestamp,
      data.fullName || "",
      data.yearsAttended || "",
      data.phone || "",
      data.email || "",
      data.profession || ""
    ]);

    // 2. Send email notification to ekvoba@gmail.com
    const subject = "New EKVOBA Old Boy Registration: " + (data.fullName || "New Member");
    const body =
      "A new Old Boy has registered on the EKVOBA website.\n\n" +
      "Full Name: " + (data.fullName || "") + "\n" +
      "Years Attended: " + (data.yearsAttended || "") + "\n" +
      "Phone Number: " + (data.phone || "") + "\n" +
      "Email Address: " + (data.email || "") + "\n" +
      "Current Profession: " + (data.profession || "") + "\n" +
      "Submitted At: " + timestamp + "\n";

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      replyTo: data.email || NOTIFICATION_EMAIL,
      subject: subject,
      body: body
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
