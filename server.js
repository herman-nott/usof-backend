const express = require('express');

const app = express();


app.use((req, res, next) => {
    console.log('heloooooooo');
    next();
});



app.get('/', (req, res) => {
    res.send('hello');
});

app.get('/profile', (req, res) => {
    res.send('getting profile');
});

app.post('/profile', (req, res) => {
    const user = {
        name: 'herman',
        age: '19'
    }
    res.send(user);
});

app.listen(3000);