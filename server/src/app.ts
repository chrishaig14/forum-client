'use strict';

import {json} from 'express';

const cors = require('cors');

let logic: Logic;

const express = require('express');
const app = express();

const corsOptions = {
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Authorization', 'Content-Type']
};

app.use(cors(corsOptions));
app.use(json());


app.post('/users', async (request, response) => {
    await logic.createUser(request.body.user);
    response.status(204).end();
});

app.post('/login', async (request, response) => {
    const {username, password} = request.body.user;
    let result = await logic.match(username, password);
    let token = username;
    if (result) {
        response.status(204).set('Authorization', token).end();
    } else {
        response.status(401).end();
    }
});

app.post('/questions', async (request, response) => {
    const newQuestion = request.body.question;
    let questionId = await logic.newQuestion({...newQuestion, username: request.headers['authorization']});
    response.status(200).json({questionId}).end();
});

app.get('/questions/:id', async (request, response) => {
    const id = request.params.id;
    let question = await logic.getQuestion(id);
    if (question) {
        response.status(200).json({question}).end();
    } else {
        response.status(404).end();
    }
});

app.post('/questions/:id/answers', async (request, response) => {
    const id = request.params.id;
    let answerId = await logic.newAnswer(id, {...request.body.answer, username: request.headers['authorization']});
    if (answerId) {
        response.status(200).json({answerId}).end();
    } else {
        response.status(404).end();
    }
});

app.get('/questions/:id/answers', async (request, response) => {
    const id = request.params.id;
    let answers = await logic.getAnswers(id);
    if (answers) {
        response.status(200).json({answers}).end();
    } else {
        response.status(404).end();
    }
});

app.get('/users/:id/questions', async (request, response) => {
    const id = request.params.id;
    let questions = await logic.getUserQuestions(id);
    if (questions) {
        response.status(200).json({questions}).end();
    } else {
        response.status(404).end();
    }
});

app.get('/users/:id/answers', async (request, response) => {
    const id = request.params.id;
    let answers = await logic.getUserAnswers(id);
    if (answers) {
        response.status(200).json({answers}).end();
    } else {
        response.status(404).end();
    }
});

app.get('/answers/:id', async (request, response) => {
    const id = request.params.id;
    let answer = await logic.getAnswer(id);
    if (answer) {
        response.status(200).json({answer}).end();
    } else {
        response.status(404).end();
    }
});


module.exports = {
    app: app.listen(8000), setLogic: (l: Logic) => {
        logic = l;
    }
};

