// Importa as bibliotecas necessárias
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config(); // Para ler variáveis de ambiente

// Cria o servidor
const app = express();

// Configura o PostgreSQL para o Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Variável que o Render vai fornecer
  ssl: {
    rejectUnauthorized: false // Necessário para conectar ao PostgreSQL do Render
  }
});

// Middleware para ler JSON do front-end
app.use(express.json());

// Configura pasta pública para o HTML
app.use(express.static('public'));

// Rota para processar logins
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // 1. Criptografa a senha (usando bcrypt - você precisa instalar: npm install bcryptjs)
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    
    // 2. Salva no banco de dados
    await pool.query(
      'INSERT INTO usuarios (email, senha) VALUES ($1, $2)',
      [email, senhaCriptografada]
    );
    
    res.status(200).json({ mensagem: 'Login salvo com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar login:', err);
    res.status(500).json({ erro: 'Falha ao salvar login' });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});