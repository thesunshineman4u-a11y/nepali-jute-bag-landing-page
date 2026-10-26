import "server-only";

import { google, sheets_v4 } from "googleapis";
import type { OrderRecord } from "@/lib/order-schema";

export const ORDER_HEADERS = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes",
] as const;

const ORDER_STATUSES = [
  "New Order",
  "Order Confirmed",
  "Order Ongoing",
  "Delivered",
  "Cancelled",
];

const SHEET_COLORS = {
  ink: { red: 0.141, green: 0.094, blue: 0.059 },
  mocha: { red: 0.294, green: 0.188, blue: 0.141 },
  champagne: { red: 0.91, green: 0.788, blue: 0.549 },
  oat: { red: 0.973, green: 0.949, blue: 0.906 },
  linen: { red: 1, green: 0.98, blue: 0.945 },
  amber: { red: 0.651, green: 0.294, blue: 0.141 },
  border: { red: 0.89, green: 0.835, blue: 0.745 },
};

const COLUMN_WIDTHS = [150, 165, 170, 130, 220, 285, 220, 85, 135, 135, 145, 155, 240];

let sheetsClient: sheets_v4.Sheets | undefined;
let sheetSetupPromise: Promise<number> | undefined;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.JWT({
    email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

function sheetRange(tabName: string, cells: string) {
  return `'${tabName.replaceAll("'", "''")}'!${cells}`;
}

async function ensureOrderSheet() {
  if (sheetSetupPromise) return sheetSetupPromise;

  sheetSetupPromise = (async () => {
    const sheets = getSheetsClient();
    const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
    const tabName = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Orders";
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets(properties,bandedRanges,conditionalFormats)",
    });

    let sheet = metadata.data.sheets?.find(
      (entry) => entry.properties?.title === tabName,
    );

    if (
      sheet?.properties?.sheetId === undefined ||
      sheet.properties.sheetId === null
    ) {
      const created = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: tabName } } }],
        },
      });
      sheet = {
        properties: created.data.replies?.[0].addSheet?.properties,
      };
    }

    const sheetId = sheet.properties?.sheetId;
    if (sheetId === undefined || sheetId === null) {
      throw new Error("Could not resolve the Google Sheet tab ID.");
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: sheetRange(tabName, "A1:M1"),
      valueInputOption: "RAW",
      requestBody: { values: [[...ORDER_HEADERS]] },
    });

    const requests: sheets_v4.Schema$Request[] = [
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: { frozenRowCount: 1 },
            tabColorStyle: { rgbColor: SHEET_COLORS.amber },
          },
          fields: "gridProperties.frozenRowCount,tabColorStyle",
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: "ROWS", startIndex: 0, endIndex: 1 },
          properties: { pixelSize: 44 },
          fields: "pixelSize",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: ORDER_HEADERS.length,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: SHEET_COLORS.mocha,
              textFormat: {
                foregroundColor: SHEET_COLORS.linen,
                fontFamily: "Arial",
                fontSize: 10,
                bold: true,
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
              borders: {
                bottom: { style: "SOLID_THICK", color: SHEET_COLORS.champagne },
              },
            },
          },
          fields: "userEnteredFormat",
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: ORDER_HEADERS.length,
          },
          cell: {
            userEnteredFormat: {
              textFormat: { foregroundColor: SHEET_COLORS.ink, fontFamily: "Arial", fontSize: 10 },
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
              borders: {
                bottom: { style: "SOLID", color: SHEET_COLORS.border },
              },
            },
          },
          fields: "userEnteredFormat(textFormat,verticalAlignment,wrapStrategy,borders)",
        },
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 1, startColumnIndex: 7, endColumnIndex: 10 },
          cell: { userEnteredFormat: { horizontalAlignment: "RIGHT" } },
          fields: "userEnteredFormat.horizontalAlignment",
        },
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 1, startColumnIndex: 8, endColumnIndex: 10 },
          cell: {
            userEnteredFormat: {
              numberFormat: { type: "NUMBER", pattern: '"NPR" #,##0' },
            },
          },
          fields: "userEnteredFormat.numberFormat",
        },
      },
      {
        repeatCell: {
          range: { sheetId, startRowIndex: 1, startColumnIndex: 11, endColumnIndex: 12 },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: "CENTER",
              textFormat: { bold: true },
            },
          },
          fields: "userEnteredFormat(horizontalAlignment,textFormat.bold)",
        },
      },
      {
        setDataValidation: {
          range: {
            sheetId,
            startRowIndex: 1,
            startColumnIndex: 11,
            endColumnIndex: 12,
          },
          rule: {
            condition: {
              type: "ONE_OF_LIST",
              values: ORDER_STATUSES.map((userEnteredValue) => ({ userEnteredValue })),
            },
            strict: true,
            showCustomUi: true,
          },
        },
      },
      {
        setBasicFilter: {
          filter: {
            range: {
              sheetId,
              startRowIndex: 0,
              startColumnIndex: 0,
              endColumnIndex: ORDER_HEADERS.length,
            },
          },
        },
      },
      ...COLUMN_WIDTHS.map((pixelSize, index) => ({
        updateDimensionProperties: {
          range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
          properties: { pixelSize },
          fields: "pixelSize",
        },
      })),
    ];

    const hasOrderBanding = sheet.bandedRanges?.some(
      (banding) =>
        banding.range?.startColumnIndex === 0 &&
        banding.range?.endColumnIndex === ORDER_HEADERS.length,
    );
    if (!hasOrderBanding) {
      requests.push({
        addBanding: {
          bandedRange: {
            range: { sheetId, startRowIndex: 0, startColumnIndex: 0, endColumnIndex: ORDER_HEADERS.length },
            rowProperties: {
              headerColor: SHEET_COLORS.mocha,
              firstBandColor: { red: 1, green: 1, blue: 1 },
              secondBandColor: SHEET_COLORS.oat,
            },
          },
        },
      });
    }

    if (!sheet.conditionalFormats?.length) {
      const statusStyles = [
        ["New Order", { red: 1, green: 0.91, blue: 0.78 }, SHEET_COLORS.amber],
        ["Order Confirmed", { red: 0.86, green: 0.93, blue: 1 }, { red: 0.12, green: 0.36, blue: 0.62 }],
        ["Order Ongoing", { red: 0.96, green: 0.91, blue: 1 }, { red: 0.43, green: 0.2, blue: 0.62 }],
        ["Delivered", { red: 0.86, green: 0.95, blue: 0.88 }, { red: 0.12, green: 0.43, blue: 0.22 }],
        ["Cancelled", { red: 1, green: 0.88, blue: 0.88 }, { red: 0.68, green: 0.12, blue: 0.12 }],
      ] as const;

      for (const [status, backgroundColor, foregroundColor] of statusStyles) {
        requests.push({
          addConditionalFormatRule: {
            index: 0,
            rule: {
              ranges: [{ sheetId, startRowIndex: 1, startColumnIndex: 11, endColumnIndex: 12 }],
              booleanRule: {
                condition: { type: "TEXT_EQ", values: [{ userEnteredValue: status }] },
                format: {
                  backgroundColor,
                  textFormat: { foregroundColor, bold: true },
                },
              },
            },
          },
        });
      }
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });

    return sheetId;
  })().catch((error) => {
    sheetSetupPromise = undefined;
    throw error;
  });

  return sheetSetupPromise;
}

export async function appendOrderToSheet(order: OrderRecord) {
  await ensureOrderSheet();
  const sheets = getSheetsClient();
  const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME?.trim() || "Orders";

  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetRange(tabName, "A2:A"),
  });
  const alreadySaved = existing.data.values?.some(
    (row) => String(row[0]) === order.orderId,
  );
  if (alreadySaved) return;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange(tabName, "A:M"),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.createdAt,
          order.customerName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.quantity,
          order.pricePerPiece,
          order.totalPrice,
          order.paymentMethod,
          order.status,
          order.notes,
        ],
      ],
    },
  });
}
