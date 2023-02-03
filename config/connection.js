const { connect, connection } = require('mongoose');

const connectionURI = 'mongodb://localhost/socialnetworkDB';

connect(connectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;

//configures connection to mongodb and links with mongoose