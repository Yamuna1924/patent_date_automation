# AdaptReady Assessment QA

A Playwright-based test automation project for verifying patent information on the WIPO (World Intellectual Property Organization) Patent Informed platform.

## Overview

This project contains automated tests that verify the differences between patent filing, publication, and grant dates using Playwright test framework.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

## Running Tests

To run the patent date verification test, use the following command:

### For ROP Patent Search

```powershell
$env:SEARCH_KEY="rop"
npx playwright test tests/patentdate.spec.js --headed --project=chromium
```

### Parameters Explained

- `$env:SEARCH_KEY="rop"`: Sets the search keyword environment variable (change "rop" to search for different patents)
- `--headed`: Runs tests in headed mode (shows the browser window during execution)
- `--project=chromium`: Specifies to run tests on Chromium browser

## Test Details

The test performs the following actions:

1. Navigates to https://patinformed.wipo.int/
2. Searches for patents using the provided SEARCH_KEY
3. Accepts the terms and conditions if prompted
4. Extracts patent information including:
   - Filing date
   - Publication date
   - Grant date
5. Calculates and verifies the differences between these dates
6. Logs the results to the console

## Environment Variables

- `SEARCH_KEY` (required): The patent search keyword (e.g., "rop", "paracetamol")

## Test Results

Test results are automatically generated and available in the `test-results/` and `playwright-report/` directories after test execution.

## Project Structure

```
.
├── tests/
│   └── patentdate.spec.js      # Patent date verification test
├── playwright.config.js         # Playwright configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## Dependencies

- `@playwright/test`: ^1.58.2 - Testing framework
- `chromium`: ^3.0.3 - Browser binary
- `@types/node`: ^25.2.3 - TypeScript type definitions
