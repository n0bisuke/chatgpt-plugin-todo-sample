const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({ origin: 'https://chat.openai.com' }));
// app.use(cors({ origin: 'localhost' }));
app.use(bodyParser.json());

const TODOS = {};

app.post('/todos/:username', (req, res) => {
    const username = req.params.username;
    const todo = req.body.todo;

    if (!TODOS[username]) {
        TODOS[username] = [];
    }

    TODOS[username].push(todo);
    res.status(200).send('OK');
});

app.get('/todos/:username', (req, res) => {
    console.log(`GET..!!`);
    const username = req.params.username;
    res.status(200).json(TODOS[username] || []);
});

app.delete('/todos/:username', (req, res) => {
    const username = req.params.username;
    const todoIdx = req.body.todo_idx;

    if (TODOS[username] && 0 <= todoIdx && todoIdx < TODOS[username].length) {
        TODOS[username].splice(todoIdx, 1);
    }

    res.status(200).send('OK');
});

app.get('/logo.png', (req, res) => {
    res.sendFile('logo.png', { root: __dirname });
});

app.get('/.well-known/ai-plugin.json', (req, res) => {
    const host = req.headers.host;
    fs.readFile('.well-known/ai-plugin.json', 'utf8', (err, text) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error reading file');
            return;
        }
        text = text.replace('PLUGIN_HOSTNAME', `https://${host}`);
        res.setHeader('Content-Type', 'text/json');
        res.send(text);
    });
});

app.get('/openapi.yaml', (req, res) => {
    const host = req.headers.host;
    fs.readFile('openapi.yaml', 'utf8', (err, text) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        text = text.replace('PLUGIN_HOSTNAME', `https://${host}`);
        res.setHeader('Content-Type', 'text/yaml');
        res.send(text);
    });
});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
