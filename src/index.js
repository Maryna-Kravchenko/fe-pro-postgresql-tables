import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'hw22',
    password: POSTGRES_PASSWORD || 'kma23011985',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(
    `DROP TABLE if exists books, authors, categories, users, descriptions, reviews`
  );

  await client.query(
    `CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(30) NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`
  );
  await client.query(
    `CREATE TABLE categories (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(30) NOT NULL)`
  );

  await client.query(
    `CREATE TABLE authors (id SERIAL PRIMARY KEY NOT NULL, name VARCHAR(30) NOT NULL)`
  );

  await client.query(
    `CREATE TABLE books (id SERIAL PRIMARY KEY NOT NULL, title VARCHAR(30) NOT NULL, userid INTEGER, authorid INTEGER, categoryid INTEGER, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(authorid) REFERENCES authors(id) ON DELETE CASCADE, FOREIGN KEY(categoryid) REFERENCES categories(id) ON DELETE CASCADE`
  );

  await client.query(
    `CREATE TABLE descriptions (id SERIAL PRIMARY KEY NOT NULL, description VARCHAR(10000) NOT NULL, bookid INTEGER UNIQUE, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE)`
  );

  await client.query(
    `CREATE TABLE reviews (id SERIAL PRIMARY KEY NOT NULL, message VARCHAR(10000) NOT NULL, userid INTEGER, bookid INTEGER, FOREIGN KEY(userid) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY(bookid) REFERENCES books(id) ON DELETE CASCADE)`
  );

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`INSERT INTO users (name) VALUES ('Maryna')`);
  await client.query(`INSERT INTO categories (name) VALUES ('роман')`);
  await client.query(`INSERT INTO authors (name) VALUES ('Виктор Пелевин')`);
  await client.query(
    `INSERT INTO books (title, userid, authorid, categoryid) VALUES ('Empire V', 1, 1, 1)`
  );
  await client.query(
    `INSERT INTO descriptions (description, bookid) VALUES ('Миром правят вампиры. Не вечно молодые, романтичные юноши и девушки с бессонными глазами и кровавыми губами, а вполне обыкновенные мужчины и женщины со следами жизненного цинизма на лице. Им одним открыт секрет "гламура" и "дискурса". И они - настоящая мировая элита, вербующая в свои ряды прохожих одним легким укусом. Выбор может пасть на каждого...', 1)`
  );
  await client.query(
    `INSERT INTO reviews (message, userid, bookid) VALUES ('Пелевин как всегда, ухватил то что витает в воздухе – и воплотил в книгу. Ай, молодец!', 1, 1)`
  );

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
