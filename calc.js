const express = require('express');
const axios = require('axios');

const app = express();
const WINDOW_SIZE = 10;
let windowState = [];
app.use(express.json());
app.get('/numbers/:numberId', async (req, res) => {
  const numberId = req.params.numberId;

  /
  if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  try {

    const response = await axios.get(`http://test-server.com/numbers/${numberId}`, {
      timeout: 500, 
    });

    const numbers = response.data;

    const newNumbers = numbers.filter((num) => !windowState.includes(num));
    windowState = [...windowState, ...newNumbers];
    windowState = [...new Set(windowState)]; 
    if (windowState.length > WINDOW_SIZE) {
      windowState = windowState.slice(-WINDOW_SIZE);
    }

   
    const avg = windowState.reduce((sum, num) => sum + num, 0) / windowState.length;

   
    res.json({
      numbers,
      windowPrevState: windowState.slice(0, -newNumbers.length),
      windowCurrState: windowState,
      avg,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch numbers from test server' });
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});