# OmVetan Payroll

React and Vite application for generating salary slips from spreadsheet data.
The app reads employee payroll rows from Excel, lets the operator select which
employees and fields to include, previews the generated slips, and exports the
result as a PDF.

## Features

- Upload `.xlsx` or `.xls` payroll files.
- Generate slips for selected employee names or all rows with `*`.
- Choose the salary fields that should appear on the slip.
- Customize the slip title and up to three signatory labels.
- Preview generated slips before export.
- Export all generated salary slips into one PDF.

## Tech stack

- React 19
- Vite 6
- Framer Motion
- Lucide React
- SheetJS for spreadsheet parsing
- jsPDF and jsPDF AutoTable for PDF output

## Getting started

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, then upload an Excel file.

## Available scripts

```bash
npm run dev      # start local development server
npm run build    # create production build
npm run preview  # preview production build
npm run lint     # run ESLint
```

## Input notes

- The first worksheet in the uploaded file is parsed.
- Employee matching is case-insensitive.
- Enter field names as comma-separated values, for example:

```text
Basic, HRA, Net Salary
```

- Enter `*` in the employee field to generate slips for every row.
