const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema');
const app = express();

app.listen('1212');

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);
