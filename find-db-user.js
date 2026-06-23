import pg from 'pg'

const { Client } = pg

async function tryConnect(user) {
  try {
    const client = new Client({ connectionString: `postgresql://${user}:@localhost:5432/postgres` })
    await client.connect()
    console.log(`SUCCESS with user: ${user}`)

    // Create mypartner_dev if it doesn't exist
    try {
      await client.query('CREATE DATABASE mypartner_dev;')
      console.log('Database mypartner_dev created')
    }
    catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Database mypartner_dev already exists')
      }
      else {
        console.error('Failed to create database:', err.message)
      }
    }

    await client.end()
    return true
  }
  catch (err) {
    console.log(`Failed with user ${user}:`, err.message)
    return false
  }
}

async function main() {
  const usersToTry = ['postgres', 'root', 'Partnership', 'admin', 'user']
  for (const user of usersToTry) {
    const success = await tryConnect(user)
    if (success) {
      process.exit(0)
    }
  }
  process.exit(1)
}

main()
