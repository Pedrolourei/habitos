// server.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const PORT = 3000;

// Inicializa o Firebase
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json'))
});

// Rota para criar um novo candidato
app.post('/candidates', async (req, res) => {
    const candidateData = req.body;
  
    try {
      // Adiciona um novo documento na coleção 'candidates'
      const docRef = await db.collection('candidates').add(candidateData);
      res.json({ id: docRef.id, ...candidateData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Rota para listar todos os candidatos
app.get('/candidates', async (req, res) => {
    try {
      // Consulta todos os documentos da coleção 'candidates'
      const snapshot = await db.collection('candidates').get();
      
      // Mapeia os documentos retornados para um array de objetos
      const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ data: candidates });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
// Rota para criar uma nova vaga
app.post('/jobs', async (req, res) => {
    const jobData = req.body;
  
    try {
      const docRef = await db.collection('jobs').add(jobData);
      res.json({ id: docRef.id, ...jobData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Rota para listar vagas com filtros opcionais
  app.get('/jobs', async (req, res) => {
    const { location, job_type } = req.query;
    let query = db.collection('jobs');
  
    if (location) query = query.where('location', '==', location);
    if (job_type) query = query.where('job_type', '==', job_type);
  
    try {
      const snapshot = await query.get();
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ data: jobs });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  



const db = admin.firestore();

app.use(bodyParser.json());
