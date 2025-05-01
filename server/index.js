
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import path from 'path'


const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve the Excel file
app.get('/api/excel', async (req, res) => {
  try {
    const remoteUrl = 'https://stagewww.utrgv.edu/it/_files/documents/iasg-gposourcedata-apr2025.xlsx';
    
    // Fetch the Excel file from the remote URL
    const response = await axios.get(remoteUrl, {
      responseType: 'arraybuffer'
    });

    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=iasg-gposourcedata-apr2025.xlsx');

    // Send the file data
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching Excel file:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch Excel file',
      message: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 