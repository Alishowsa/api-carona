const db = require('../database/db');

// criar carona 
exports.criar = (req, res) => {
  const { origem, destino, horario, vagas } = req.body;
  const motorista_id = req.usuario.id; // vem do token JWT

  if (!origem || !destino || !horario || !vagas) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  db.query(
    `INSERT INTO caronas (motorista_id, origem, destino, horario, vagas)
     VALUES (?, ?, ?, ?, ?)`,
    [motorista_id, origem, destino, horario, vagas],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err.message });

      res.status(201).json({
        mensagem: 'Carona criada com sucesso',
        id: result.insertId
      });
    }
  );
};
// solicitar vaga 
exports.listar = (req, res) => {
  db.query(
    `SELECT caronas.*, usuarios.nome AS motorista
     FROM caronas
     JOIN usuarios ON caronas.motorista_id = usuarios.id
     ORDER BY caronas.horario ASC`,
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      res.json(results);
    }
  );
};

exports.buscarPorId = (req, res) => {
  db.query(
    `SELECT caronas.*, usuarios.nome AS motorista
     FROM caronas
     JOIN usuarios ON caronas.motorista_id = usuarios.id
     WHERE caronas.id = ?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Carona não encontrada' });
      }

      res.json(results[0]);
    }
  );
};
 
exports.atualizar = (req, res) => {
  const { origem, destino, horario, vagas } = req.body;
  const motorista_id = req.usuario.id;

  // só o motorista dono pode editar
  db.query(
    'SELECT * FROM caronas WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Carona não encontrada' });
      }

      if (results[0].motorista_id !== motorista_id) {
        return res.status(403).json({ erro: 'Você não tem permissão para editar esta carona' });
      }

      db.query(
        `UPDATE caronas
         SET origem = ?, destino = ?, horario = ?, vagas = ?
         WHERE id = ?`,
        [origem, destino, horario, vagas, req.params.id],
        (err) => {
          if (err) return res.status(500).json({ erro: err.message });

          res.json({ mensagem: 'Carona atualizada com sucesso' });
        }
      );
    }
  );
};

// deletar carona só se for o motorista dono
exports.deletar = (req, res) => {
  const motorista_id = req.usuario.id;

  // só o motorista dono pode deletar
  db.query(
    'SELECT * FROM caronas WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Carona não encontrada' });
      }

      if (results[0].motorista_id !== motorista_id) {
        return res.status(403).json({ erro: 'Você não tem permissão para deletar esta carona' });
      }

      db.query(
        'DELETE FROM caronas WHERE id = ?',
        [req.params.id],
        (err) => {
          if (err) return res.status(500).json({ erro: err.message });

          res.json({ mensagem: 'Carona removida com sucesso' });
        }
      );
    }
  );
};
