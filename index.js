const express = require('express');
const graphqlHTTP = require('express-graphql');

const { hydrometriesSchema } = require('./schema');
const { getHydrometries, getHydrometryById } = require('./dataloader');

const { hydrometries, hydrometry } = hydrometriesSchema;
const app = express();

app.listen('1212');

app.use(
    '/graphql/hydrometries/:id',
    graphqlHTTP(req => ({
        schema: hydrometry,
        context: {
            getHydrometry: getHydrometryById(req.params.id),
        },
        graphiql: true,
    }))
);

app.use(
    '/graphql/hydrometries',
    graphqlHTTP(req => ({
        schema: hydrometries,
        context: {
            getHydrometries: getHydrometries(),
        },
        graphiql: true,
    }))
);
