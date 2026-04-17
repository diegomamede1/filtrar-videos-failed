const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname)));

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});