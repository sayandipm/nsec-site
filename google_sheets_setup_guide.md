# Google Sheets Integration Setup Guide for ZEST Registration Form

This guide will walk you through setting up Google Sheets to automatically collect registration data from your ZEST website.

---

## 📋 **Step 1: Create Google Spreadsheet**

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"Blank"** to create a new spreadsheet
3. Rename the spreadsheet (e.g., "ZEST 2026 Registrations")
4. **Save the Spreadsheet ID** from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part (the long string between `/d/` and `/edit`)

---

## 📊 **Step 2: Set Up Spreadsheet Columns**

Create the following columns in **Row 1** (Header Row):

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H |
|----------|----------|----------|----------|----------|----------|----------|----------|
| **Timestamp** | **Full Name** | **Phone Number** | **Department** | **Year** | **Sports** | **Partner Name** | **Partner Department** |
| | | | | | | | |
| | | | | | | | |

**Continue with more columns:**

| Column I | Column J |
|----------|----------|
| **Partner Phone** | **Status** |

### 📝 **Column Details:**

1. **Timestamp** (Column A) - Auto-filled with submission time
2. **Full Name** (Column B) - Student's full name
3. **Phone Number** (Column C) - 10-digit phone number
4. **Department** (Column D) - Department code (cs, ec, me, ce, ee, ch, bt, ae)
5. **Year** (Column E) - Year of study (1, 2, 3, 4)
6. **Sports** (Column F) - Comma-separated list of selected sports
7. **Partner Name** (Column G) - Partner's name (if doubles events selected)
8. **Partner Department** (Column H) - Partner's department (if doubles events selected)
9. **Partner Phone** (Column I) - Partner's phone number (if doubles events selected)
10. **Status** (Column J) - Optional: Can be used for manual status tracking

### 🎨 **Optional: Format Header Row**

- Select Row 1
- Make it **Bold** and **Centered**
- Add background color (e.g., light blue)
- Freeze Row 1: **View → Freeze → 1 row**

---

## 🔧 **Step 3: Create Google Apps Script**

1. In your Google Spreadsheet, click **Extensions → Apps Script**
2. Delete any default code in the editor
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get current timestamp
    const timestamp = new Date();

    // Example payload:
    // data.sports = "Badminton - Mens Singles, Badminton - Mens Doubles, Chess - Open"
    // data.partnerDetails = '[{"sport":"Badminton - Mens Doubles","partnerName":"...","partnerPhone":"..."}]'
    const selectedSports = (data.sports || '')
      .split(/\s*,\s*/)
      .map(s => s.trim())
      .filter(Boolean);

    // partnerDetailsList is sent from the website for each Doubles sport
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

    // If for any reason "selectedSports" is empty, fall back to doubles sports from partnerDetails
    const sportsToWrite = selectedSports.length > 0
      ? selectedSports
      : partnerDetailsList.map(p => p.sport);

    // Write ONE ROW PER SELECTED SPORT.
    // - For Singles sports: partner columns stay empty.
    // - For Doubles sports: partner columns come from the matching partnerDetails entry.
    sportsToWrite.forEach(sport => {
      const partner = partnerBySport.get(sport);

      const rowData = [
        timestamp,                                   // Column A: Timestamp
        data.fullName || '',                         // Column B: Full Name
        data.phone || '',                            // Column C: Phone Number
        data.department || '',                        // Column D: Department
        data.year || '',                             // Column E: Year
        sport,                                       // Column F: Sports (single sport per row)
        partner ? (partner.partnerName || '') : '', // Column G: Partner Name
        data.partnerDepartment || '',                // Column H: Partner Department (may be blank)
        partner ? (partner.partnerPhone || '') : '',// Column I: Partner Phone
        'Submitted'                                  // Column J: Status
      ];

      sheet.appendRow(rowData);
    });
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for testing)
function testDoPost() {
  const testData = {
    fullName: 'Test Student',
    phone: '1234567890',
    department: 'cs',
    year: '2',
    sports: 'Badminton - Mens Singles, Table Tennis - Mens Doubles',
    partnerDepartment: 'ec',
    partnerDetails: JSON.stringify([
      { sport: 'Table Tennis - Mens Doubles', partnerName: 'Test Partner', partnerPhone: '0987654321' }
    ])
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(mockEvent);
}
```

4. Click **Save** (💾 icon) or press `Ctrl+S`
5. Give your project a name (e.g., "ZEST Registration Handler")

---

## 🚀 **Step 4: Deploy as Web App**

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to **"Select type"** → Choose **"Web app"**
3. Fill in the deployment settings:
   - **Description**: "ZEST Registration Form Handler" (optional)
   - **Execute as**: Select **"Me"** (your email)
   - **Who has access**: Select **"Anyone"** (important!)
4. Click **Deploy**
5. **Authorize the script:**
   - Click **"Authorize access"**
   - Choose your Google account
   - Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
   - Click **"Allow"** to grant permissions
6. **Copy the Web App URL** - It will look like:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
   ```
   ⚠️ **IMPORTANT**: Save this URL - you'll need it in the next step!

---

## 🔗 **Step 5: Link to Your Website**

1. Open your project file: `script.js`
2. Find this line (around line 14):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
   ```
3. Replace `'PASTE_YOUR_WEB_APP_URL_HERE'` with your Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec';
   ```
4. Save the file

---

## ✅ **Step 6: Test the Integration**

1. Open your website (`index.html`)
2. Navigate to the **Student Portal** section
3. Fill out the registration form:
   - Enter a test name
   - Enter a 10-digit phone number
   - Select a department and year
   - Select at least one sport
   - (Optional) If you select a doubles event, fill partner details
4. Click **"Submit Registration"**
5. Check your Google Spreadsheet - you should see a new row with the submitted data!

---

## 🔍 **Troubleshooting**

### Problem: Data not appearing in spreadsheet
- ✅ Check that the Web App URL is correct in `script.js`
- ✅ Verify the Web App is deployed with "Anyone" access
- ✅ Check browser console (F12) for errors
- ✅ Ensure the script has proper permissions

### Problem: "Script authorization required"
- ✅ Re-deploy the script and authorize again
- ✅ Make sure you clicked "Allow" when prompted

### Problem: CORS errors
- ✅ The script uses `mode: 'no-cors'` which is correct for Google Apps Script
- ✅ Check that the Web App URL is accessible

### Problem: Wrong column order
- ✅ Make sure your spreadsheet headers match exactly:
  - Column A: Timestamp
  - Column B: Full Name
  - Column C: Phone Number
  - Column D: Department
  - Column E: Year
  - Column F: Sports
  - Column G: Partner Name
  - Column H: Partner Department
  - Column I: Partner Phone
  - Column J: Status

---

## 📝 **Data Format Examples**

### Example 1: Single Sport Registration
```
Timestamp: 2026-02-18 10:30:00
Full Name: John Doe
Phone Number: 9876543210
Department: cs
Year: 2
Sports: Badminton - Mens Singles
Partner Name: (empty)
Partner Department: (empty)
Partner Phone: (empty)
Status: Submitted
```

### Example 2: Multiple Sports with Doubles
```
Timestamp: 2026-02-18 11:15:00
Full Name: Jane Smith
Phone Number: 9876543211
Department: ec
Year: 3
Sports: Badminton - Mens Doubles, Table Tennis - Mens Singles, Chess - Open
Partner Name: Bob Johnson
Partner Department: me
Partner Phone: 9876543212
Status: Submitted
```

---

## 🔐 **Security Notes**

1. **Web App Access**: Setting to "Anyone" allows your website to submit data without authentication. This is necessary for public forms.
2. **Rate Limiting**: Google Apps Script has daily quotas. For high-volume sites, consider:
   - Adding error handling
   - Implementing client-side validation (already done)
   - Using Google Forms as an alternative for very high volumes

---

## 📚 **Additional Resources**

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Web Apps Guide](https://developers.google.com/apps-script/guides/web)

---

## 🎯 **Quick Checklist**

- [ ] Created Google Spreadsheet
- [ ] Added all 10 columns with headers
- [ ] Created Google Apps Script
- [ ] Deployed as Web App with "Anyone" access
- [ ] Copied Web App URL
- [ ] Updated `GOOGLE_SCRIPT_URL` in `script.js`
- [ ] Tested form submission
- [ ] Verified data appears in spreadsheet

---

**Need Help?** If you encounter any issues, check the browser console (F12) for error messages and verify each step above.
