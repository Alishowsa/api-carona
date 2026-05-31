const db = require("../config/db");

const Solicitacao = {

  // criar solicitação
  create: (data, callback) => {
    const sql = `
      INSERT INTO solicitacoes (carona_id, passageiro_id)
      VALUES (?, ?)
    `;

    db.query(sql, [data.carona_id, data.passageiro_id], callback);
  },

  // listar solicitações de uma carona
  findByCarona: (carona_id, callback) => {
    const sql = `
      SELECT 
        s.id,
        s.carona_id,
        s.passageiro_id,
        s.status,
        s.created_at,
        u.nome AS passageiro
      FROM solicitacoes s
      INNER JOIN usuarios u ON s.passageiro_id = u.id
      WHERE s.carona_id = ?
    `;

    db.query(sql, [carona_id], callback);
  },

  // ATUALIZAR STATUS (aceita / recusada / pendente)
  updateStatus: (id, status, callback) => {
    const sql = `
      UPDATE solicitacoes
      SET status = ?
      WHERE id = ?
    `;

    db.query(sql, [status, id], callback);
  },

  // buscar solicitação por ID
  findById: (id, callback) => {
    const sql = `
      SELECT 
        id,
        carona_id,
        passageiro_id,
        status,
        created_at
      FROM solicitacoes
      WHERE id = ?
    `;

    db.query(sql, [id], callback);
  }

};

module.exports = Solicitacao;