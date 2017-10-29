const { GraphQLSchema, GraphQLObjectType, GraphQLList } = require('graphql');

const { HydrometryType, WeatherType, PlaceType } = require('./type/hydrometries');

const hydrometry = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            hydrometry: {
                type: HydrometryType,
                resolve: (root, args, context) => context.getHydrometry,
            },
            weather: {
                type: WeatherType,
                resolve: (root, args, context) => context.getHydrometry,
            },
        }),
    }),
});

const hydrometries = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            hydrometries: {
                type: new GraphQLList(HydrometryType),
                resolve: (root, args, context) => context.getHydrometries.then(hydrometries => hydrometries.data),
            },
            weather: {
                type: WeatherType,
                resolve: (root, args, context) => context.getHydrometries.then(hydrometries => hydrometries.lastEntry),
            },
            place: {
                type: PlaceType,
                resolve: (root, args, context) => context.getHydrometries.then(hydrometries => hydrometries.lastEntry),
            },
        }),
    }),
});

module.exports = {
    hydrometries,
    hydrometry,
};
