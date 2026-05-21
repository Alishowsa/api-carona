const express = require('express');
const app = express();

app.use(express.json());

//Banco de dados
const db = require('./database/db');

//Rotas
const usuariosRoutes = require('./routes/usuariosRoutes');
const caronaRoutes = require('./routes/caronaRoutes');

app.use('/usuarios', usuariosRoutes);
app.use('/caronas', caronaRoutes);

//Rota inicial
app.get('/', (req, res) => {
  res.send('API Carona Universitária Inteligente funcionando 🚗');
});

//Servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
