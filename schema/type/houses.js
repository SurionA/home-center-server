const moment = require('moment');
const { GraphQLObjectType, GraphQLString } = require('graphql');

const HouseType = new GraphQLObjectType({
    name: 'HouseType',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: house => house._id,
        },
        name: {
            type: GraphQLString,
            resolve: house => house.name,
        },
        address: {
            type: GraphQLString,
            resolve: house => house.address,
        },
        city: {
            type: GraphQLString,
            resolve: house => house.town,
        },
        country: {
            type: GraphQLString,
            resolve: house => house.country,
        },
        isPrincipalResidence: {
            type: GraphQLString,
            resolve: house => house.isPrincipalResidence,
        },
        fullAddress: {
            type: GraphQLString,
            resolve: house => `${house.address}, ${house.town}, ${house.country}`,
        },
        datetime: {
            type: GraphQLString,
            resolve: house => `${moment(house.createdAt).format('D MMM YYYY HH:mm:ss')}`,
        },
    }),
});

module.exports = {
    HouseType,
};
