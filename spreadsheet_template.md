# Google Spreadsheet Template for ZEST Registration

## 📊 Exact Column Structure

Copy this structure exactly into **Row 1** of your Google Spreadsheet:

```
| A           | B          | C            | D          | E     | F      | G            | H                  | I              | J        |
|-------------|------------|--------------|------------|-------|--------|--------------|--------------------|----------------|----------|
| Timestamp   | Full Name  | Phone Number | Department | Year  | Sports | Partner Name | Partner Department | Partner Phone  | Status   |
```

## 📋 Column Details & Data Types

| Column | Header Name | Data Type | Description | Example |
|--------|-------------|-----------|-------------|---------|
| **A** | Timestamp | Date/Time | Auto-filled submission time | 2026-02-18 10:30:00 |
| **B** | Full Name | Text | Student's full name | John Doe |
| **C** | Phone Number | Text (10 digits) | Student's phone number | 9876543210 |
| **D** | Department | Text (code) | Department abbreviation | cs, ec, me, ce, ee, ch, bt, ae |
| **E** | Year | Number | Year of study | 1, 2, 3, or 4 |
| **F** | Sports | Text | Selected sport (single value per row) | "Badminton - Mens Singles" |
| **G** | Partner Name | Text | Partner's name (if doubles) | Jane Smith |
| **H** | Partner Department | Text (code) | Partner's department (if doubles) | ec |
| **I** | Partner Phone | Text (10 digits) | Partner's phone (if doubles) | 9876543211 |
| **J** | Status | Text | Registration status | Submitted |

## 🎯 Department Codes Reference

| Code | Full Department Name |
|------|---------------------|
| cs | Computer Science |
| ec | Electronics |
| me | Mechanical |
| ce | Civil Engineering |
| ee | Electrical |
| ch | Chemical Engineering |
| bt | Biotechnology |
| ae | Aerospace |

## 🏃 Sports Categories Reference

The form allows selection of these sports:

### Badminton
- Badminton - Mens Singles
- Badminton - Mens Doubles
- Badminton - Womens Singles
- Badminton - Womens Doubles
- Badminton - Mixed Doubles

### Table Tennis
- Table Tennis - Mens Singles
- Table Tennis - Mens Doubles
- Table Tennis - Womens Singles
- Table Tennis - Womens Doubles
- Table Tennis - Mixed Doubles

### Carrom
- Carrom - Mens Singles
- Carrom - Mens Doubles
- Carrom - Womens Singles
- Carrom - Womens Doubles
- Carrom - Mixed Doubles

### Team Sports
- Handball - Mens
- Handball - Womens
- Volleyball - Mens
- Football - Mens
- Chess - Open
- Darts - Open

## 📝 Sample Data Row

Here's what a complete registration entry looks like:

```
| Timestamp           | Full Name | Phone Number | Department | Year | Sports                                                    | Partner Name | Partner Department | Partner Phone | Status    |
|---------------------|-----------|--------------|------------|------|-----------------------------------------------------------|--------------|--------------------|---------------|-----------|
| 2026-02-18 10:30:00 | John Doe  | 9876543210   | cs         | 2    | Table Tennis - Mens Doubles                               | Jane Smith   | ec                 | 9876543211    | Submitted |
```

## ⚠️ Important Notes

1. **Column Order**: The columns MUST be in this exact order (A through J)
2. **Header Row**: Row 1 should contain ONLY the headers
3. **Data Starts**: Data will be appended starting from Row 2
4. **Empty Fields**: Partner fields (G, H, I) will be empty if no doubles events are selected
5. **Multiple Sports**: If a student selects multiple sports (especially multiple doubles), your backend should create **one row per selected sport**; Column F will contain only that single sport for each row

## 🔧 Formatting Recommendations

1. **Freeze Header Row**: View → Freeze → 1 row
2. **Bold Headers**: Select Row 1 → Format → Bold
3. **Column Width**: Auto-resize columns for better readability
4. **Timestamp Format**: Format Column A as Date/Time
5. **Phone Format**: Format Columns C and I as Plain Text (to preserve leading zeros if any)
