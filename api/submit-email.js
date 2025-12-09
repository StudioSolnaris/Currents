import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append email to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:B', // Assumes emails go in Column A, Date in B
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [email, new Date().toISOString()]
        ],
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sheet Error', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
