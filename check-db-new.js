import pg from 'pg'

const { Client } = pg
const client = new Client({ connectionString: 'postgresql://root:@localhost:5432/postgres' })
client.connect()
  .then(() => client.query('CREATE DATABASE mypartner_dev;'))
  .then(() => console.log('Database mypartner_dev created'))
  .catch((err) => {
    if (err.message.includes('already exists')) {
      console.log('Database mypartner_dev already exists')
    }
    else {
      console.error(err)
    }
  })
  .finally(() => process.exit(0))
