const db = require('../config/db');

const Carona = {

    criar: (dados, callback) => {

        const sql = `
            INSERT INTO caronas
            (motorista_id, origem, destino, horario, vagas)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(sql, [
            dados.motorista_id,
            dados.origem,
            dados.destino,
            dados.horario,
            dados.vagas
        ], callback);
    },

    listar: (callback) => {

        const sql = `
            SELECT
                caronas.*,
                usuarios.nome AS motorista_nome
            FROM caronas
            JOIN usuarios
            ON caronas.motorista_id = usuarios.id
        `;

        db.query(sql, callback);
    }

};

module.exports = Carona;