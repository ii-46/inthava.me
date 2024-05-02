import { newArticle } from "../src/service/article";
import { newUser } from "../src/service/user";
import slugify from "slugify";
import { faker } from "@faker-js/faker";
import { newWorkshop } from "../src/service/workshop";
import { Article } from "../src/model/article";
import { User } from "../src/model/user";
import { Workshop } from "../src/model/workshop";

const userID = "84527264-3cdc-44ed-9f05-91991d391756";
const article: Article = {
  title: "Hello World",
  content: "Hello World",
  category: "Hello World",
  tags: ["Hello World"],
  thumbnail: "Hello World",
  description: "Hello World",
  status: "Hello World",
  authorId: "6a6abf7d-40a5-4719-b930-a610cff12b98",
  authorName: "Hello World",
};
const user: User = {
  email: "test1",
  name: "inthava",
  password: "test1",
};

function createRandomUser(): User {
  const email = faker.internet.email();
  const name = faker.person.firstName();
  const password = faker.internet.password();
  return {
    email,
    name,
    password,
  };
}

function createRandomArticle(): Article {
  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraphs();
  const category = faker.lorem.word();
  const tags = faker.lorem
    .words()
    .split(" ")
    .map((tag) => tag.trim());
  const thumbnail = faker.image.url();
  const description = faker.lorem.sentence();
  const status = "public";
  const authorId = userID;
  const authorName = faker.person.firstName();
  return {
    title,
    content,
    category,
    tags: tags,
    thumbnail,
    description,
    status,
    authorId,
    authorName,
  };
}

function createRandomWorkshop(): Workshop {
  const title = faker.lorem.sentence();
  const description = faker.lorem.paragraphs();
  const location = faker.lorem.word();
  const link = faker.lorem.word();
  const time = faker.lorem.word();
  const thumbnail = faker.image.url();
  const speaker = faker.person.firstName();
  const eventType = faker.lorem.word();
  const detail = faker.lorem.sentence();
  const status = "public";
  const userId = userID;
  const startDate = faker.date.future().toTimeString();
  return {
    title,
    description,
    location,
    link,
    time,
    thumbnail,
    speaker,
    eventType,
    detail,
    status,
    userId,
  };
}

for (let i = 0; i < 5; i++) {
  const article = createRandomArticle();
  newArticle(article)
    .then((article) => {
      console.log(article);
    })
    .catch((err) => {
      console.log(err);
    });
  newWorkshop(createRandomWorkshop())
    .then((workshop) => {
      console.log(workshop);
    })
    .catch((err) => {
      console.log(err);
    });
}

// newArticle(article).then((article) => {
//     console.log(article);
// }).catch((err) => {
//     console.log(err);
// });

// newUser(createRandomUser()).then((user) => {
//   console.log(user);
// }).catch((err) => {
//   console.log(err);
// });

// newWorkshop(createRandomWorkshop()).then((workshop) => {
//   console.log(workshop);
// }).catch((err) => {
//   console.log(err);
// });
