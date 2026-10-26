# Nepali Jute Bag COD Sales Funnel

A production-ready Next.js sales funnel for Cash on Delivery orders. It includes a responsive product landing page, server-validated checkout, thank-you page, Google Sheets order storage, business Gmail notification, and customer confirmation email.

## What is included

- `/` — conversion-focused landing page with one hero image, five-image carousel, live quantity/price calculation, trust elements, benefits, illustrative review placeholders, FAQ, and repeated CTAs.
- `/checkout` — prefilled product summary plus customer delivery form, client/server validation, loading state, and duplicate-click protection.
- `/thank-you` — order confirmation with product, quantity, total, order ID, and COD details.
- `POST /api/order` — validates pricing on the server, generates an order ID, prepares the Google Sheet, appends the order, sends both emails, and only then returns success.

The reel section is intentionally omitted because no reel URLs were supplied.

## Order flow

1. The customer selects a bag and quantity on the landing page.
2. Only the selected SKU and quantity are carried to checkout. Display prices are recalculated from the product catalog.
3. Checkout sends customer details and the visible order summary to `POST /api/order`.
4. The API validates every field and compares all prices with the server-side catalog to prevent price tampering.
5. A deterministic unique order ID is created from the checkout submission ID. Retrying the same submission will not append a duplicate spreadsheet row.
6. The API ensures the `Orders` tab has a frozen mocha header, alternating linen rows, tailored column widths, NPR currency formatting, filters, and colour-coded status dropdowns, then appends the order.
7. The business receives a Gmail-compatible HTML notification while the customer receives a branded confirmation email.
9. Only after those operations succeed does checkout redirect to `/thank-you`.

External services cannot provide a true distributed transaction. If Google Sheets succeeds and an email provider then fails, the API returns an error while preserving the order row. A retry reuses the same order ID and skips the duplicate row.

## Local setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Never commit `.env.local`. The provided `.gitignore` excludes environment files.

## Environment variables

Copy `.env.example` to `.env.local` locally, or add the same names in Vercel → Project → Settings → Environment Variables.

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-domain.example
FRONTEND_URL=https://your-domain.example

BUSINESS_EMAIL=orders@your-domain.example
EMAIL_FROM="Nepali Jute Bag <your-gmail-address@gmail.com>"
BRAND_NAME=Nepali Jute Bag

GOOGLE_SHEET_ID=your_spreadsheet_id
GOOGLE_SHEET_TAB_NAME=Orders
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-gmail-address@gmail.com
SMTP_PASS=your_16_character_google_app_password

EMAIL_SERVICE_API_KEY=
ORDER_INTEGRATION_MODE=live
```

`EMAIL_SERVICE_API_KEY` is reserved for a future Resend/Brevo/SendGrid adapter; Gmail SMTP uses the `SMTP_*` values. In Vercel, paste `GOOGLE_PRIVATE_KEY` with its newline escapes intact. The server converts `\n` into real newlines.

### Security warning

Never paste private keys or Gmail App Passwords into source code, chat messages, screenshots, or a public repository. If a credential was exposed, revoke it in Google Cloud/Google Account Security and create a replacement before deploying.

## Google Spreadsheet setup

The application can create and format the tab inside an existing spreadsheet, but a service account cannot create a spreadsheet in your personal Drive unless you separately implement Drive ownership. Create the spreadsheet once in your own Google account:

1. Go to [Google Sheets](https://sheets.google.com) and create a blank spreadsheet, for example **Nepali Jute Bag Orders**.
2. You may leave the first tab as-is. The application creates an `Orders` tab automatically if it does not exist.
3. The server writes these columns in order:
   - Order ID
   - Date & Time
   - Customer Name
   - Phone Number
   - Email Address
   - Exact Location
   - Product Name
   - Quantity
   - Price Per Piece
   - Total Price
   - Payment Method
   - Order Status
   - Notes
4. On first successful order, the application applies the branded mocha/champagne theme, freezes the header, adds filters and alternating rows, sizes every column deliberately, formats NPR values, and creates a colour-coded Order Status dropdown with: `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, and `Cancelled`.
5. To find the Sheet ID, open the spreadsheet URL. In `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`, copy the text between `/d/` and `/edit`.
6. Put that value in `GOOGLE_SHEET_ID`; use `Orders` for `GOOGLE_SHEET_TAB_NAME` unless you want a different tab title.

### Google Cloud service account

1. Open [Google Cloud Console](https://console.cloud.google.com) and create/select a project.
2. Go to **APIs & Services → Library** and enable **Google Sheets API**. Google Drive API is optional for this implementation because it does not create Drive files.
3. Go to **IAM & Admin → Service Accounts** and create a service account.
4. Open it, select **Keys → Add key → Create new key → JSON**.
5. Copy `client_email` into `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` into `GOOGLE_PRIVATE_KEY` in your environment settings. Do not keep the downloaded JSON in this repository.
6. In Google Sheets, click **Share** and give the service-account email **Editor** access. Without this step, order submission will fail with a permission error.

## Gmail App Password setup

1. Use the Gmail account that will send notifications and enable 2-Step Verification.
2. Open Google Account → Security → **App passwords**.
3. Create an app password named `Nepali Jute Bag Orders`.
4. Put the generated 16-character value in `SMTP_PASS` without spaces.
5. Set `SMTP_USER` to that Gmail address and `EMAIL_FROM` to a display-name format using the same address.
6. Set `BUSINESS_EMAIL` to the inbox that should receive new-order notifications.

Google Workspace administrators may need to allow App Passwords. If Gmail rejects the sign-in, confirm 2-Step Verification, the sender address, and Workspace policy.

## Testing

### Automated checks

```bash
npm run typecheck
npm test
npm run build
```

### Full browser flow without Google/Gmail

Set `ORDER_INTEGRATION_MODE=mock` only in `.env.local`, run `npm run dev`, place a test order, and confirm that checkout redirects to the thank-you page. Mock mode deliberately skips Sheets and email.

### Live integration test

1. Set `ORDER_INTEGRATION_MODE=live` and add all Google/SMTP values.
2. Place an order using an email inbox you can check.
3. Confirm a new row appears in the `Orders` sheet with status `New Order`.
4. Confirm `BUSINESS_EMAIL` receives “New Product Order Received”.
5. Confirm the customer inbox receives “Your Order Has Been Received”.
6. Confirm the browser redirects to the thank-you page only after completion.
7. Test a bad email and missing location to verify inline errors; temporarily use a bad SMTP password to verify failure does not redirect.

## Deploying to Vercel

1. Push this project to a private GitHub/GitLab/Bitbucket repository.
2. In Vercel, choose **Add New → Project**, import the repository, and keep **Framework Preset: Next.js**.
3. Add every production environment variable listed above. Use `ORDER_INTEGRATION_MODE=live`.
4. Set both `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the exact production origin, such as `https://your-project.vercel.app` (no trailing path).
5. Deploy. Vercel uses `npm run build` automatically.
6. After assigning a custom domain, update both URL variables to that domain and redeploy.
7. Run the live integration checklist above.

Do not deploy until the previously exposed Google private key and Gmail App Password have been revoked and replaced.

## Editing product details

Product names, prices, offer prices, benefits, FAQs, and image paths live in `lib/product.ts`. The current Dashain and Tihar checkout price is NPR 2,999 per bag, reduced from NPR 3,999 for an automatic NPR 1,000 (25%) saving. Prices are enforced there on the server as well as displayed in the interface. Update both the original and offer price deliberately; do not trust values sent by the browser.

The three review cards are explicitly labeled illustrative. Replace them with verified customer feedback before representing them as testimonials.
