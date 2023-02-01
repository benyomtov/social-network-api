const { connect, connection } = require('mongoose');

const connectionURI = 'mongodb://localhost/socialnetworkDB';

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connection;