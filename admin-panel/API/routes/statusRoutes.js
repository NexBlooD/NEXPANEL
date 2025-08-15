const express = require('express');
const router = express.Router();

// Rota de status do backend
router.get('/status', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      status: 'OK',
      message: 'Server is running.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: 'Failed to retrieve server status.',
      error: error.message,
    });
  }
});

module.exports = router;
