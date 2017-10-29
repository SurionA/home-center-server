const moment = require('moment');
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');

const { HouseType, RoomType } = require('./index');

const TempHumType = new GraphQLObjectType({
    name: 'TempHumType',
    description: '...',

    fields: () => ({
        temperature: {
            type: GraphQLString,
            resolve: hydrometry => `${hydrometry.temperature}°C`,
        },
        humidity: {
            type: GraphQLString,
            resolve: hydrometry => `${hydrometry.humidity} %`,
        },
    }),
});

const WeatherType = new GraphQLObjectType({
    name: 'WeatherType',
    description: '...',

    fields: () => ({
        sunrise: {
            type: GraphQLString,
            resolve: hydrometry => `${moment.unix(hydrometry.sunrise).format('D MMM YYYY HH:mm:ss')}`,
        },
        sunset: {
            type: GraphQLString,
            resolve: hydrometry => `${moment.unix(hydrometry.sunset).format('D MMM YYYY HH:mm:ss')}`,
        },
        icon: {
            type: GraphQLString,
            resolve: hydrometry => hydrometry.weather[0].icon,
        },
    }),
});

const PlaceType = new GraphQLObjectType({
    name: 'PlaceType',
    description: '...',

    fields: () => ({
        house: {
            type: HouseType,
            resolve: place => place.room.house,
        },
        room: {
            type: RoomType,
            resolve: place => place.room,
        },
    }),
});

const HydrometryType = new GraphQLObjectType({
    name: 'Hydrometry',
    description: '...',

    fields: () => ({
        id: {
            type: GraphQLString,
            resolve: hydrometry => hydrometry._id,
        },
        room: {
            type: RoomType,
            resolve: hydrometry => hydrometry.room,
        },
        inside: {
            type: TempHumType,
            resolve: hydrometry => ({
                humidity: hydrometry.inside_humidity,
                temperature: hydrometry.inside_temperature,
            }),
        },
        outside: {
            type: TempHumType,
            resolve: hydrometry => ({
                humidity: hydrometry.outside_humidity,
                temperature: hydrometry.outside_temperature,
            }),
        },
        datetime: {
            type: GraphQLString,
            resolve: hydrometry => `${moment(hydrometry.createdAt).format('D MMM YYYY HH:mm:ss')}`,
        },
    }),
});

module.exports = {
    HydrometryType,
    PlaceType,
    WeatherType,
};
