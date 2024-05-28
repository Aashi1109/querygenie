import { faker } from "@faker-js/faker";
import prisma from "../prisma";

function generateUsers(count: number) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const username = faker.internet.userName();
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const image = faker.image.avatar();

    users.push({
      username,
      name,
      email,
      image,
    });
  }
  return users;
}

function getRandomValueFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function generateMessages(count: number) {
  const messages = [];
  const userIds = [1];
  const chatId = [3];
  for (let i = 0; i < count; i++) {
    const query = faker.lorem.slug();
    messages.push({
      query,
      chatId: chatId[0],
      answer: faker.lorem.sentence(),
    });
  }

  return messages;
}

async function seedUserDatabase(count) {
  try {
    // Remove existing users
    await prisma.user.deleteMany();

    // Generate fake users
    const users = generateUsers(count);

    // Insert users into the database
    await prisma.user.createMany({ data: users });

    console.log(`Database seeded with ${count} users successfully`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
  }
}

async function seedMessageDatabase(count) {
  try {
    // Remove existing users
    await prisma.message.deleteMany();

    // Generate fake users
    const messages = generateMessages(count);

    // Insert messages into the database
    await prisma.message.createMany({ data: messages });

    console.log(`Database seeded with ${count} messages successfully`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
  }
}

seedUserDatabase(200);
seedMessageDatabase(50000);
