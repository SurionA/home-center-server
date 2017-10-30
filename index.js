const express = require('express');
const graphqlHTTP = require('express-graphql');

const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const { hydrometriesSchema } = require('./schema');
const { getHydrometries, getHydrometryById } = require('./dataloader');

const { hydrometries, hydrometry } = hydrometriesSchema;
const app = express();

const helperMiddleware = [
    bodyParser.json(),
    bodyParser.text({ type: 'application/graphql' }),
    (req, res, next) => {
        if (req.is('application/graphql')) {
            req.body = { query: req.body };
        }
        next();
    },
];

app.listen('1212');

app.use(
    '/graphql/hydrometries/:id',
    ...helperMiddleware,
    graphqlExpress(req => ({
        schema: hydrometry,
        context: {
            getHydrometry: getHydrometryById(req.params.id),
        },
        graphiql: true,
    }))
);
//app.get('/graphiql/hydrometry', graphiqlExpress({ endpointURL: '/graphql/hydrometries/:id' }));

app.use(
    '/graphql/hydrometries',
    ...helperMiddleware,
    graphqlExpress(req => ({
        schema: hydrometries,
        context: {
            getHydrometries: getHydrometries(),
        },
        graphiql: true,
    }))
);
app.get('/graphiql/hydrometries', graphiqlExpress({ endpointURL: '/graphql/hydrometries' }));
