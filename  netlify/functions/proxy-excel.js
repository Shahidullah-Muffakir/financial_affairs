
import axios from 'axios';

exports.handler = async function(event, context) {
  try {
    const response = await axios.get(
      'https://stagewww.utrgv.edu/it/_files/documents/iasg-gposourcedata-apr2025.xlsx',
      {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://stagewww.utrgv.edu/'
        }
      }
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=data.xlsx'
      },
      body: Buffer.from(response.data).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Excel file' })
    };
  }
};