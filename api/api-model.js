const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

module.exports = {
    find,
    findByUsername,
    add
}

function find(){
    return db('users')
}

function findById(id){
    return db('users')
    .where({ id: id})
    .first()
}

function findByUsername(username){
    return db('users')
    .where({ username: username })
    .first()
}

function add(credentials){
    return db('users')
    .insert(credentials)
        .then(([id]) => {
            return findById(id)
        })
}
