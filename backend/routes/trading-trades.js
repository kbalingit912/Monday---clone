const express = require('express');
const TradingTrade = require('../models/trading-trades');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all trades
router.get('/', async (req, res) => {
  try {
    const trades = await TradingTrade.getAll();
    res.json({ data: trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get trade by ID
router.get('/:id', async (req, res) => {
  try {
    const trade = await TradingTrade.getById(req.params.id);
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json({ data: trade });
  } catch (error) {
    console.error('Error fetching trade:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create trade
router.post('/', async (req, res) => {
  try {
    const id = uuidv4();
    const trade = {
      id,
      ...req.body
    };

    const result = await TradingTrade.create(trade);
    res.json({ data: result });
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update trade
router.put('/:id', async (req, res) => {
  try {
    const result = await TradingTrade.update(req.params.id, req.body);
    res.json({ data: result });
  } catch (error) {
    console.error('Error updating trade:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete trade
router.delete('/:id', async (req, res) => {
  try {
    const result = await TradingTrade.delete(req.params.id);
    res.json({ data: result });
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
