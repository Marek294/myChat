import express from 'express';
import path from 'path';

let app = express();

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
})

const port = process.env.port || 3000;

app.listen(port, () => console.log('Running on port '+port));