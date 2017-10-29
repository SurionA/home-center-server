const axios = require('axios');
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const getHydrometries = axios
    .get('http://home.suriona.com/home-center/api/hydrometries')
    .then(hydrometries => hydrometries.data);

const HydrometryType = new GraphQLObjectType({
    name: 'Hydrometry',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: hydrometry => hydrometry._id,
        },
        temperature: {
            type: GraphQLString,
            resolve: hydrometry => `${hydrometry.inside_temperature} °C`,
        },
        humidity: {
            type: GraphQLString,
            resolve: hydrometry => `${hydrometry.inside_humidity} %`,
        },
    }),
});
module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            hydrometries: {
                type: new GraphQLList(HydrometryType),
                resolve: () => getHydrometries,
            },
        }),
    }),
});
