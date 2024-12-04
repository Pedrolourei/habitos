const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-key.json'))
});

const db = admin.firestore();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF ou Word são permitidos.'));
    }
  }
});

const authenticateAdmin = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (userDoc.exists && userDoc.data().userType === 'admin') {
      return next();
    } else {
      return res.status(403).json({ error: 'Permissão negada: Administrador necessário' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(403).json({ error: 'Token não fornecido' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// ---------------------- Rotas para Administrador -----------------------

app.post('/admin/jobs', authenticateAdmin, async (req, res) => {
  const { title, description, location, salary } = req.body;
  try {
    const jobData = {
      employerId: req.user.uid, 
      title,
      description,
      location,
      salary,
      status: 'open', 
      createdAt: new Date(),
    };

    const jobRef = await db.collection('jobs').add(jobData);
    res.status(201).json({ message: 'Vaga criada com sucesso', jobId: jobRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
});

app.put('/admin/jobs/:jobId', authenticateAdmin, async (req, res) => {
  const { jobId } = req.params;
  const { title, description, location, salary, status } = req.body;

  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    await db.collection('jobs').doc(jobId).update({
      title,
      description,
      location,
      salary,
      status: status || jobDoc.data().status, 
    });

    res.status(200).json({ message: 'Vaga editada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar vaga' });
  }
});

app.put('/admin/jobs/:jobId/hide', authenticateAdmin, async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    await db.collection('jobs').doc(jobId).update({ status: 'hidden' });
    res.status(200).json({ message: 'Vaga ocultada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ocultar vaga' });
  }
});

app.put('/admin/jobs/:jobId/close', authenticateAdmin, async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    await db.collection('jobs').doc(jobId).update({ status: 'closed' });
    res.status(200).json({ message: 'Vaga fechada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fechar vaga' });
  }
});

app.delete('/admin/jobs/:jobId', authenticateAdmin, async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    await db.collection('jobs').doc(jobId).delete();
    res.status(200).json({ message: 'Vaga excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir vaga' });
  }
});
)
app.put('/admin/jobs/:jobId/reopen', authenticateAdmin, async (req, res) => {
  const { jobId } = req.params;

  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();

    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    await db.collection('jobs').doc(jobId).update({ status: 'open' });
    res.status(200).json({ message: 'Vaga reaberta com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao reabrir vaga' });
  }
});

// ------------------- Funções para Gerenciar Candidaturas -----------------

app.get('/admin/candidates/:userId/applications', authenticateAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const applicationsSnapshot = await db.collection('applications')
      .where('userId', '==', userId)
      .get();

    if (applicationsSnapshot.empty) {
      return res.status(404).json({ error: 'Nenhuma candidatura encontrada' });
    }

    const applications = applicationsSnapshot.docs.map(doc => doc.data());
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar candidaturas' });
  }
});

app.post('/admin/apply/:jobId', authenticateAdmin, async (req, res) => {
  const { jobId } = req.params;
  const { userId } = req.body;  
  try {
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!jobDoc.exists || !userDoc.exists) {
      return res.status(404).json({ error: 'Vaga ou Candidato não encontrado' });
    }

    await db.collection('applications').add({
      jobId,
      userId,
      status: 'applied',
      appliedAt: new Date(),
    });

    res.status(200).json({ message: 'Candidatura realizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aplicar candidato' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
