// Importar dependências
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Inicializar o Firebase com credenciais
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json'))
});

// Conectar ao Firestore
const db = admin.firestore();

const app = express();
const PORT = 3000; // Definir a porta

// Middleware para analisar o corpo da requisição como JSON
app.use(bodyParser.json());

// Endpoint para criar um candidato
app.post('/candidates', async (req, res) => {
  const candidateData = req.body;

  try {
    // Adicionar candidato ao Firestore
    const docRef = await db.collection('candidates').add(candidateData);
    res.json({ id: docRef.id, ...candidateData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint para listar todos os candidatos
app.get('/candidates', async (req, res) => {
  try {
    // Consultar candidatos do Firestore
    const snapshot = await db.collection('candidates').get();
    const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ data: candidates });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
