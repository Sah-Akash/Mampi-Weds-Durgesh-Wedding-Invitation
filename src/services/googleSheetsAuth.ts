import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// Flag to indicate if we are in the middle of a sign-in flow.
let isSigningIn = false;
// Cache the access token strictly in memory (never localStorage or sessionStorage).
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Sheets access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface RsvpRecord {
  id: string;
  submittedAt: string;
  guestName: string;
  phone: string;
  attendance: 'joyfully_attending' | 'regretfully_unable';
  guestCount: number;
  side: 'bride' | 'groom' | 'both';
  events: string[];
  arrivalInfo: string;
  message: string;
  syncedToSheet?: boolean;
}

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  firstSheetTitle: string;
}

export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

export async function fetchSpreadsheetMetadata(
  spreadsheetId: string,
  accessToken: string
): Promise<SheetMetadata> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Unable to read Google Sheet (${res.status}): ${errText}`);
  }
  const data = await res.json();
  const firstSheetTitle =
    data.sheets?.[0]?.properties?.title || 'Wedding RSVPs';
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Wedding RSVP Sheet',
    spreadsheetUrl:
      data.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    firstSheetTitle,
  };
}

export async function createWeddingRsvpSpreadsheet(
  accessToken: string
): Promise<SheetMetadata> {
  const tabTitle = 'RSVPs';
  const createRes = await fetch(
    'https://sheets.googleapis.com/v4/spreadsheets',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: 'Mampi Weds Durgesh — Live Wedding RSVPs (24.11.2026)',
        },
        sheets: [
          {
            properties: {
              title: tabTitle,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
          },
        ],
      }),
    }
  );

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create spreadsheet: ${errText}`);
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId as string;

  // Populate header row
  const headers = [
    [
      'Submitted At',
      'Guest Name',
      'Phone / WhatsApp',
      'Attendance Status',
      'Number of Guests',
      'Family Side',
      'Ceremonies Attending',
      'Travel / Arrival Info',
      'Blessings for Mampi & Durgesh',
    ],
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(`${tabTitle}!A1:I1`)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: `${tabTitle}!A1:I1`,
        majorDimension: 'ROWS',
        values: headers,
      }),
    }
  );

  return {
    spreadsheetId,
    title: created.properties?.title || 'Mampi Weds Durgesh — Live Wedding RSVPs',
    spreadsheetUrl:
      created.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    firstSheetTitle: tabTitle,
  };
}

export async function appendRsvpRecordsToSheet(
  spreadsheetId: string,
  sheetTabTitle: string,
  records: RsvpRecord[],
  accessToken: string
): Promise<void> {
  if (records.length === 0) return;

  const rows = records.map((r) => [
    r.submittedAt,
    r.guestName,
    r.phone,
    r.attendance === 'joyfully_attending'
      ? 'Joyfully Attending'
      : 'Regretfully Unable',
    String(r.guestCount),
    r.side === 'bride'
      ? "Bride's Side (Mampi)"
      : r.side === 'groom'
        ? "Groom's Side (Durgesh)"
        : 'Both Families',
    r.events.join(', '),
    r.arrivalInfo || 'Standard Arrival',
    r.message || 'Best wishes & blessings!',
  ]);

  const range = `${sheetTabTitle}!A:I`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        majorDimension: 'ROWS',
        values: rows,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to append RSVP to Google Sheet: ${errText}`);
  }
}

export async function fetchRsvpRowsFromSheet(
  spreadsheetId: string,
  sheetTabTitle: string,
  accessToken: string
): Promise<RsvpRecord[]> {
  const range = `${sheetTabTitle}!A2:I200`;
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch rows from Google Sheet: ${errText}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows
    .filter((row) => row.length >= 2 && row[1]?.trim())
    .map((row, idx) => ({
      id: `sheet-row-${idx}-${row[0] || Date.now()}`,
      submittedAt: row[0] || 'Synced from Sheet',
      guestName: row[1] || 'Honored Guest',
      phone: row[2] || '',
      attendance:
        row[3] && row[3].toLowerCase().includes('unable')
          ? 'regretfully_unable'
          : 'joyfully_attending',
      guestCount: Number.parseInt(row[4] || '1', 10) || 1,
      side:
        row[5] && row[5].toLowerCase().includes('groom')
          ? 'groom'
          : row[5] && row[5].toLowerCase().includes('both')
            ? 'both'
            : 'bride',
      events: row[6]
        ? row[6].split(',').map((s) => s.trim())
        : ['Wedding (24.11.2026)'],
      arrivalInfo: row[7] || '',
      message: row[8] || '',
      syncedToSheet: true,
    }));
}
