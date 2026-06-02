const db = require('../database/db');

// criar solicitação
exports.solicitar = (req, res) => {

    const carona_id = req.params.carona_id;
    const passageiro_id = req.usuario.id;

    // buscar carona 
    db.query(
        'SELECT id, motorista_id, vagas FROM caronas WHERE id = ?',
        [carona_id],
        (err, results) => {

            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ erro: 'Carona não encontrada' });
            }

            const carona = results[0];

            // impedir motorista de solicitar própria carona
            if (carona.motorista_id === passageiro_id) {
                return res.status(400).json({
                    erro: 'Você não pode solicitar vaga na própria carona'
                });
            }

            // impedir se não tiver vagas
            if (carona.vagas <= 0) {
                return res.status(400).json({
                    erro: 'Não há vagas disponíveis nesta carona'
                });
            }

            // impedir duplicado
            db.query(
                `SELECT id FROM solicitacoes
                 WHERE carona_id = ?
                 AND passageiro_id = ?`,
                [carona_id, passageiro_id],
                (err, solicitacoes) => {

                    if (err) {
                        return res.status(500).json({ erro: err.message });
                    }

                    if (solicitacoes.length > 0) {
                        return res.status(400).json({
                            erro: 'Você já solicitou vaga nesta carona'
                        });
                    }

                    // criar solicitação
                    db.query(
                        `INSERT INTO solicitacoes (carona_id, passageiro_id)
                         VALUES (?, ?)`,
                        [carona_id, passageiro_id],
                        (err, result) => {

                            if (err) {
                                return res.status(500).json({ erro: err.message });
                            }

                            return res.status(201).json({
                                mensagem: 'Solicitação enviada com sucesso',
                                id: result.insertId
                            });

                        }
                    );

                }
            );

        }
    );
};

// aceitar solicitação
exports.aceitar = (req, res) => {

    const id = req.params.id;

    // buscar solicitação
    db.query(
        'SELECT * FROM solicitacoes WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Solicitação não encontrada'
                });
            }

            const solicitacao = results[0];

             // só pode aceitar se estiver pendente
            if (solicitacao.status !== 'pendente') {
                return res.status(400).json({
                     erro: `Solicitação já está ${solicitacao.status}`
             });
            }

            // buscar carona
            db.query(
                'SELECT vagas, motorista_id FROM caronas WHERE id = ?',
                [solicitacao.carona_id],
                (err2, caronas) => {

                    if (err2) {
                        return res.status(500).json({ erro: err2.message });
                    }

                    if (caronas.length === 0) {
                        return res.status(404).json({
                            erro: 'Carona não encontrada'
                        });
                    }

                    // apenas o motorista dono da carona pode aceitar
                    if (caronas[0].motorista_id !== req.usuario.id) {
                        return res.status(403).json({
                            erro: 'Você não tem permissão para aceitar esta solicitação'
                        });
                    }

                    // verificar vagas
                    if (caronas[0].vagas <= 0) {
                        return res.status(400).json({
                            erro: 'Não há vagas disponíveis nesta carona'
                        });
                    }

                    // aceitar solicitação
                    db.query(
                        "UPDATE solicitacoes SET status = 'aceita' WHERE id = ?",
                        [id],
                        (err3) => {

                            if (err3) {
                                return res.status(500).json({
                                    erro: err3.message
                                });
                            }

                            // diminuir vaga
                            db.query(
                                "UPDATE caronas SET vagas = vagas - 1 WHERE id = ?",
                                [solicitacao.carona_id],
                                (err4) => {

                                    if (err4) {
                                        return res.status(500).json({
                                            erro: err4.message
                                        });
                                    }

                                    return res.json({
                                        mensagem: 'Solicitação aceita com sucesso'
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};
// recusar solicitação
exports.recusar = (req, res) => {

    const id = req.params.id;

    // buscar solicitação
    db.query(
        'SELECT * FROM solicitacoes WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Solicitação não encontrada'
                });
            }

            const solicitacao = results[0];
            
            // só pode recusar se estiver pendente
            if (solicitacao.status !== 'pendente') {
                return res.status(400).json({
                     erro: `Solicitação já está ${solicitacao.status}`
                 });
            }

            // buscar carona
            db.query(
                'SELECT motorista_id FROM caronas WHERE id = ?',
                [solicitacao.carona_id],
                (err2, caronas) => {

                    if (err2) {
                        return res.status(500).json({ erro: err2.message });
                    }

                    if (caronas.length === 0) {
                        return res.status(404).json({
                            erro: 'Carona não encontrada'
                        });
                    }

                    // apenas o motorista dono da carona pode recusar
                    if (caronas[0].motorista_id !== req.usuario.id) {
                        return res.status(403).json({
                            erro: 'Você não tem permissão para recusar esta solicitação'
                        });
                    }

                    // recusar solicitação
                    db.query(
                        "UPDATE solicitacoes SET status = 'recusada' WHERE id = ?",
                        [id],
                        (err3) => {

                            if (err3) {
                                return res.status(500).json({
                                    erro: err3.message
                                });
                            }

                            return res.json({
                                mensagem: 'Solicitação recusada com sucesso'
                            });
                        }
                    );
                }
            );
        }
    );
};
// listar solicitações de uma carona
 exports.listar = (req, res) => {

  db.query(
    `SELECT
        s.id,
        s.status,
        u.nome,
        u.email
     FROM solicitacoes s
     JOIN usuarios u
        ON s.passageiro_id = u.id
     WHERE s.carona_id = ?`,
    [req.params.carona_id],
    (err, results) => {

      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      res.json(results);
    }
  );
};
// buscar solicitação por ID
exports.buscarPorId = (req, res) => {

  db.query(
    'SELECT * FROM solicitacoes WHERE id = ?',
    [req.params.id],
    (err, results) => {

      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({
          erro: 'Solicitação não encontrada'
        });
      }

      res.json(results[0]);
    }
  );
};
// cancelar solicitação
exports.cancelar = (req, res) => {

    const id = req.params.id;

    // buscar solicitação
    db.query(
        'SELECT * FROM solicitacoes WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    erro: 'Solicitação não encontrada'
                });
            }

            const solicitacao = results[0];

            // apenas quem criou pode cancelar
            if (solicitacao.passageiro_id !== req.usuario.id) {
                return res.status(403).json({
                    erro: 'Você não tem permissão para cancelar esta solicitação'
                });
            }

            // excluir solicitação
            db.query(
                'DELETE FROM solicitacoes WHERE id = ?',
                [id],
                (err2) => {

                    if (err2) {
                        return res.status(500).json({
                            erro: err2.message
                        });
                    }

                    return res.json({
                        mensagem: 'Solicitação cancelada com sucesso'
                    });
                }
            );
        }
    );
};
// listar minhas solicitações
exports.minhasSolicitacoes = (req, res) => {

    const passageiro_id = req.usuario.id;

    db.query(
        `SELECT
            s.id,
            s.status,
            c.id AS carona_id,
            c.origem,
            c.destino,
            c.horario
        FROM solicitacoes s
        JOIN caronas c
            ON s.carona_id = c.id
        WHERE s.passageiro_id = ?
        ORDER BY s.id DESC`,
        [passageiro_id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    erro: err.message
                });
            }

            res.json(results);
        }
    );
};