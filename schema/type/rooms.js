const moment = require('moment');
const { GraphQLObjectType, GraphQLString } = require('graphql');

const { HouseType } = require('./houses');

const RoomType = new GraphQLObjectType({
    name: 'RoomType',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: room => room._id,
        },
        name: {
            type: GraphQLString,
            resolve: room => room.name,
        },
        house: {
            type: HouseType,
            resolve: room => room.house,
        },
        datetime: {
            type: GraphQLString,
            resolve: room => `${moment(room.createdAt).format('D MMM YYYY HH:mm:ss')}`,
        },
    }),
});

module.exports = {
    RoomType,
};
