const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqls3rv3r',
    database: 'db_projeto_integrador'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados MySQL:', err.message);
    } else {
        console.log('Conectado ao banco de dados MySQL.');
        // db.query(`CREATE TABLE IF NOT EXISTS users (
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     nome VARCHAR(255) NOT NULL,
        //     telefone VARCHAR(20),
        //     email VARCHAR(255) UNIQUE,
        //     foto BLOB,
        //     data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        // );`, (err) => {
        //     if (err) {
        //         console.error('Erro ao criar tabela:', err.message);
        //     } else {
        //         console.log('Tabela "users" verificada/criada com sucesso.');
        //     }
        // });
    }
});

// Rota para criar um novo contato
// Rota para criar um novo contato
app.post('/addpeca', async (req, res) => {
    const { id_Cor, id_Tamanho, id_Material, Data_hora } = req.body;

    try {
        const sql = `INSERT INTO tb_Pecas (id_Cor, id_Tamanho, id_Material, Data_hora) VALUES (?, ?, ?, ?)`;
        db.query(sql, [id_Cor, id_Tamanho, id_Material, Data_hora], (err, results) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ id: results.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro na inserção: ' + error.message });
    }
});

// Rota para listar todos os contatos
app.get('/getpecas', (req, res) => {
    const sql = `SELECT * FROM tb_Pecas`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(results);
    });
});

// Rota para atualizar um contato
app.put('/contatos/:id', async (req, res) => {
    const { nome, telefone, email, foto, salario_real } = req.body;
    const { id } = req.params;

    try {
        const response = await axios.get(`https://api.hgbrasil.com/finance?key=c74ed6cc`);
        const usd = response.data.results.currencies.USD.buy;
        const eur = response.data.results.currencies.EUR.buy;

        const salario_dolar = salario_real / usd;
        const salario_euro = salario_real / eur;

        const sql = `UPDATE contatos SET nome = ?, telefone = ?, email = ?, foto = ?, salario_real = ?, salario_dolar = ?, salario_euro = ? WHERE id = ?`;
        db.query(sql, [nome, telefone, email, foto, salario_real, salario_dolar, salario_euro, id], (err, results) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ changes: results.affectedRows });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao converter moeda' });
    }
});

// Rota para deletar um contato
app.delete('/contatos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM contatos WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ changes: results.affectedRows });
    });
});
