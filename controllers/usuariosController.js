const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// CADASTRO
exports.cadastrar = (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos' }); 
  }

  const senhaCriptografada = bcrypt.hashSync(senha, 10);

  db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaCriptografada],
    (err, result) => {
      if (err) {
        // Email duplicado
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }
        return res.status(500).json({ erro: err.message });
      }

      res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        id: result.insertId
      });
    }
  );
};

// LOGIN
exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe e-mail e senha' });
  }

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ erro: err.message });

      if (results.length === 0) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const usuario = results[0];
      const senhaOk = bcrypt.compareSync(senha, usuario.senha);

      if (!senhaOk) {
        return res.status(401).json({ erro: 'Senha inválida' });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      res.json({
        mensagem: 'Login realizado com sucesso',
        token
      });
    }
  );
};
