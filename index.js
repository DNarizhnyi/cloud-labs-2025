require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h2>Лабораторна робота №1 працює!</h2><p>Перейдіть: <a href="/cities">/cities</a></p>');
});

app.get('/cities', async (req, res) => {
  try {
    const citiesRef = db.collection('cities');
    const snapshot = await citiesRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Колекція порожня' });
    }

    const cities = [];
    snapshot.forEach(doc => {
      cities.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущено: http://localhost:${port}`);
  console.log(`Перевірка міст: http://localhost:${port}/cities`);
});