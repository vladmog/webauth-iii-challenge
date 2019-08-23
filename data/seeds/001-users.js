
exports.seed = function(knex) {
    return knex('users').insert([
      {id: 1, username: 'vladmog', password: 'hashhh', department: 'Sales'},
      {id: 2, username: 'vladeeo', password: 'slinginggg', department: 'Custodial'},
      {id: 3, username: 'lightcatch', password: 'slasherrr', department: 'Management'}
    ]);
};
