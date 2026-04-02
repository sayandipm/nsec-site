function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);

    // Get current timestamp
    const timestamp = new Date();

    // data.sports example:
    // "Badminton - Mens Singles, Badminton - Mens Doubles, Chess - Open"
    const selectedSports = (data.sports || '')
      .split(/\s*,\s*/)
      .map(s => s.trim())
      .filter(Boolean);

    // partnerDetails is sent from the website for each doubles sport
    let partnerDetailsList = [];
    if (data.partnerDetails) {
      partnerDetailsList =
        typeof data.partnerDetails === 'string'
          ? JSON.parse(data.partnerDetails)
          : data.partnerDetails;
    }

    // Build quick lookup: sport -> { partnerName, partnerPhone }
    const partnerBySport = new Map(
      (partnerDetailsList || []).map(p => [p.sport, p])
    );

    // If "selectedSports" is empty for any reason, fall back to partnerDetails sports
    const sportsToWrite = selectedSports.length > 0
      ? selectedSports
      : partnerDetailsList.map(p => p.sport);

    // Write ONE ROW PER SELECTED SPORT.
    sportsToWrite.forEach(sport => {
      const partner = partnerBySport.get(sport);

      const rowData = [
        timestamp,                                   // A: Timestamp
        data.fullName || '',                         // B: Full Name
        data.phone || '',                            // C: Phone Number
        data.department || '',                       // D: Department
        data.year || '',                             // E: Year
        sport,                                       // F: Sports (single value per row)
        partner ? (partner.partnerName || '') : '', // G: Partner Name
        data.partnerDepartment || '',              // H: Partner Department (may be blank)
        partner ? (partner.partnerPhone || '') : '',// I: Partner Phone
        'Submitted'                                  // J: Status
      ];

      sheet.appendRow(rowData);
    });

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

