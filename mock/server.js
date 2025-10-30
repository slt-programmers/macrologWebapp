const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const data = require('./data.json');

app.get('/healthcheck', (req, res) => {
  res.json(true);
});

app.post('/api/authenticate', (req, res) => {
  res.json(data.userAccount);
});

app.get('/food', (req, res) => {
  res.json(data.food);
});
app.get('/dishes', (req, res) => {
  res.json(data.dishes);
});
app.get('/settings/goalProtein', (req, res) => {
  res.json(data.goalProtein);
});
app.get('/settings/goalFat', (req, res) => {
  res.json(data.goalFat);
});
app.get('/settings/goalCarbs', (req, res) => {
  res.json(data.goalCarbs);
});

app.get('/logs/day/*', (req, res) => {
  res.json(data.logs);
});

app.get('/logs/macros', (req, res) => {
  res.json(data.logs);
});
app.get('/activities/day/*', (req, res) => {
  res.json(data.activities);
});
app.get('/settings/connectivity/STRAVA', (req, res) => {
  res.json(data.activities);
});

app.get('/settings/user', (req, res) => {
  res.json(data.user);
});
app.get('/weight', (req, res) => {
  res.json(data.weight);
});

app.listen(8090, () => {
  console.log('Mock API listening on http://localhost:8090');
});