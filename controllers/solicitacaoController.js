const db = require('../database/db');

// SOLICITAR VAGA
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

// ACEITAR SOLICITAÇÃO
exports.aceitar = (req, res) => {

    const id = req.params.id;

    // 1. buscar solicitação
    db.query(
        'SELECT * FROM solicitacoes WHERE id = ?',
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ erro: 'Solicitação não encontrada' });
            }

            const solicitacao = results[0];

            // 2. evitar aceitar duas vezes
            if (solicitacao.status === 'aceita') {
                return res.status(400).json({
                    erro: 'Essa solicitação já foi aceita'
                });
            }

            // 3. verificar vagas antes de aceitar
            db.query(
                'SELECT vagas FROM caronas WHERE id = ?',
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

                    if (caronas[0].vagas <= 0) {
                        return res.status(400).json({
                            erro: 'Não há vagas disponíveis nesta carona'
                        });
                    }

                    // 4. aceitar solicitação
                    db.query(
                        "UPDATE solicitacoes SET status = 'aceita' WHERE id = ?",
                        [id],
                        (err3) => {
                            if (err3) {
                                return res.status(500).json({ erro: err3.message });
                            }

                            // 5. diminuir vaga
                            db.query(
                                "UPDATE caronas SET vagas = vagas - 1 WHERE id = ?",
                                [solicitacao.carona_id],
                                (err4) => {
                                    if (err4) {
                                        return res.status(500).json({ erro: err4.message });
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

// RECUSAR SOLICITAÇÃO
exports.recusar = (req, res) => {

    const id = req.params.id;

    db.query(
        "UPDATE solicitacoes SET status = 'recusada' WHERE id = ?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            return res.json({
                mensagem: 'Solicitação recusada com sucesso'
            });

        }
    );
};