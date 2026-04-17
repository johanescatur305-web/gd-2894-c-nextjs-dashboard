import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function createTables(db: postgres.Sql) {
  await db`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await db`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;
  await db`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      image_url VARCHAR(255) NOT NULL
    );
  `;
  await db`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id),
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;
  await db`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;
}

async function resetTables(db: postgres.Sql) {
  await db`TRUNCATE TABLE invoices, customers, revenue, users`;
}

async function seedUsers(db: postgres.Sql) {
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return db`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
      `;
    }),
  );

  return insertedUsers;
}

async function seedInvoices(db: postgres.Sql) {
  const insertedInvoices = await Promise.all(
    invoices.map(
      (invoice) => db`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
      `,
    ),
  );

  return insertedInvoices;
}

async function seedCustomers(db: postgres.Sql) {
  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => db`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
      `,
    ),
  );

  return insertedCustomers;
}

async function seedRevenue(db: postgres.Sql) {
  const insertedRevenue = await Promise.all(
    revenue.map(
      (rev) => db`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
      `,
    ),
  );

  return insertedRevenue;
}

export async function GET() {
  try {
    await sql.begin(async (db) => {
      await createTables(db);
      await resetTables(db);
      await seedUsers(db);
      await seedCustomers(db);
      await seedInvoices(db);
      await seedRevenue(db);
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
