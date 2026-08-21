const db = require('../db/init');

class TradingTrade {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM trading_trades ORDER BY date DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM trading_trades WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static create(trade) {
    return new Promise((resolve, reject) => {
      const { id, date, session, direction, entryPrice, exitPrice, stopLoss, takeProfit, positionSize, riskAmount, riskRatio, riskPercent, pnl, returnPercent, tradingNotes } = trade;

      const sql = `
        INSERT INTO trading_trades (id, date, session, direction, entry_price, exit_price, stop_loss, take_profit, position_size, risk_amount, risk_ratio, risk_percent, pnl, return_percent, trading_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      console.log('Creating trade:', { id, date, direction, entryPrice, exitPrice });

      db.run(sql, [id, date, session, direction, entryPrice, exitPrice, stopLoss, takeProfit, positionSize, riskAmount, riskRatio, riskPercent, pnl, returnPercent, tradingNotes], (err) => {
        if (err) {
          console.error('Error creating trade:', err);
          reject(err);
        } else {
          console.log('Trade created successfully:', id);
          resolve({ id, ...trade });
        }
      });
    });
  }

  static update(id, trade) {
    return new Promise((resolve, reject) => {
      const { date, session, direction, entryPrice, exitPrice, stopLoss, takeProfit, positionSize, riskAmount, riskRatio, riskPercent, pnl, returnPercent, tradingNotes } = trade;

      const sql = `
        UPDATE trading_trades
        SET date = ?, session = ?, direction = ?, entry_price = ?, exit_price = ?, stop_loss = ?, take_profit = ?, position_size = ?, risk_amount = ?, risk_ratio = ?, risk_percent = ?, pnl = ?, return_percent = ?, trading_notes = ?
        WHERE id = ?
      `;

      db.run(sql, [date, session, direction, entryPrice, exitPrice, stopLoss, takeProfit, positionSize, riskAmount, riskRatio, riskPercent, pnl, returnPercent, tradingNotes, id], (err) => {
        if (err) reject(err);
        else resolve({ id, ...trade });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM trading_trades WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = TradingTrade;
