// Update with your config settings.

module.exports = {

  development: {
      client: 'postgresql',
      connection: {
          host: 'ec2-54-247-177-33.eu-west-1.compute.amazonaws.com',
          database: 'd5e47jq4ufupef',
          user:     'wegbymoucxcdpt',
          password: '59304ae94f1465892d0bdbca609edef7fcc8eab172364911498770240e784990',
          ssl: true
      },
      pool: {
          min: 2,
          max: 10
      },
      migrations: {
          tableName: 'knex_migrations'
      }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
