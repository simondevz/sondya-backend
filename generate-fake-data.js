import connectDB from "./config/db.js";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "./models/users.model.js";
import Category from "./models/categories.model.js";
import GroupChat from "./models/groupchat.model.js";
import GroupMembership from "./models/groupMembership.model.js";
import Product from "./models/products.model.js";
import Service from "./models/services.model.js";
import ProductOrder from "./models/productOrder.model.js";
import ServiceOrder from "./models/serviceOrder.model.js";

const imageUrls = [
  "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
  "https://images.pexels.com/photos/34950/pexels-photo.jpg",
  "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg",
  "https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg",
  "https://images.pexels.com/photos/158607/cairn-fog-mystical-background-158607.jpeg",
  "https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg",
  "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg",
  "https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg",
  "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg",
  "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
  "https://images.unsplash.com/photo-1475728621402-c32f5e784b30",
];

function getRandomNumber({ min, max }) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to create random users
const generateUsers = async () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await User.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      country: faker.location.country(),
    });
    users.push(user);
  }
  return users;
};

// Generate categories
const generateCategories = async () => {
  for (let i = 0; i < 5; i++) {
    await Category.create({
      category: faker.commerce.department(),
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      image: [
        {
          url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
          public_id: faker.string.uuid(),
          folder: "categories",
        },
      ],
    });
  }
};

// Generate group chats and group memberships
const generateGroupChatsAndMemberships = async (users) => {
  for (let i = 0; i < 5; i++) {
    const groupChat = await GroupChat.create({
      admin_id: users[Math.floor(Math.random() * users.length)]._id,
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      status: "active",
      image: [
        {
          url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
          public_id: faker.string.uuid(),
          folder: "group_chats",
        },
      ],
    });

    for (let j = 0; j < 3; j++) {
      await GroupMembership.create({
        user_id: users[Math.floor(Math.random() * users.length)]._id,
        group_id: groupChat._id,
      });
    }
  }
};

// Generate products
const generateProducts = async () => {
  let products = [];
  for (let i = 0; i < 5; i++) {
    const product = await Product.create({
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      sub_category: faker.commerce.productAdjective(),
      description: faker.lorem.sentence(),
      total_stock: getRandomNumber({ min: 1, max: 100 }),
      tag: faker.commerce.productAdjective(),
      brand: faker.company.name(),
      model: faker.commerce.productName(),
      owner: {
        id: faker.string.uuid(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        country: faker.location.country(),
      },
      old_price: faker.commerce.price(),
      current_price: faker.commerce.price(),
      discount_percentage: getRandomNumber({ min: 1, max: 50 }),
      vat_percentage: getRandomNumber({ min: 1, max: 25 }),
      product_status: "available",
      hot_products: faker.datatype.boolean(),
      rating: getRandomNumber({ min: 1, max: 5 }),
      total_rating: getRandomNumber({ min: 0, max: 100 }),
      total_variants: getRandomNumber({ min: 1, max: 5 }),
      variants: {
        color: [faker.color.human()],
        size: [
          ["xs", "sm", "md", "lg", "xl"][getRandomNumber({ min: 0, max: 4 })],
        ],
      },
      location: {
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        zip_code: faker.location.zipCode(),
        address: faker.location.streetAddress(),
      },
      image: [
        {
          url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
          public_id: faker.string.uuid(),
          folder: "products",
        },
      ],
    });
    products = [...products, product];
  }
  return products;
};

// Generate services
const generateServices = async () => {
  let services = [];
  for (let i = 0; i < 5; i++) {
    const service = await Service.create({
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      description: faker.lorem.sentence(),
      owner: {
        id: faker.string.uuid(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        country: faker.location.country(),
      },
      price: faker.commerce.price(),
      status: "active",
      image: [
        {
          url: imageUrls[Math.floor(Math.random() * imageUrls.length)],
          public_id: faker.string.uuid(),
          folder: "services",
        },
      ],
    });
    services = [...services, service];
  }
  return services;
};

// Helper function to generate Product Orders
const generateProductOrders = async (users, products) => {
  for (let i = 0; i < 5; i++) {
    const randomBuyer = users[Math.floor(Math.random() * users.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    await ProductOrder.create({
      buyer: {
        id: randomBuyer._id,
        username: randomBuyer.username,
        email: randomBuyer.email,
      },
      batch_id: faker.string.alphanumeric(6),
      order_id: faker.string.alphanumeric(6),
      checkout_items: [
        {
          _id: randomProduct._id,
          name: randomProduct.name,
          category: randomProduct.category,
          sub_category: randomProduct.sub_category,
          description: randomProduct.description,
          owner: randomProduct.owner,
          total_stock: randomProduct.total_stock,
          tag: randomProduct.tag,
          brand: randomProduct.brand,
          model: randomProduct.model,
          current_price: randomProduct.current_price,
          product_status: randomProduct.product_status,
          old_price: randomProduct.old_price,
          discount_percentage: randomProduct.discount_percentage,
          vat_percentage: randomProduct.vat_percentage,
          total_variants: randomProduct.total_variants,
          order_quantity: getRandomNumber({ min: 1, max: 5 }),
          sub_total:
            randomProduct.current_price * getRandomNumber({ min: 1, max: 5 }),
          shipping_fee: getRandomNumber({ min: 5, max: 20 }),
          tax: randomProduct.vat_percentage,
          discount: randomProduct.discount_percentage,
          total_price:
            randomProduct.current_price * getRandomNumber({ min: 1, max: 5 }) +
            getRandomNumber({ min: 5, max: 20 }),
          image: randomProduct.image,
          Location: randomProduct.location,
          track_distance_time: {
            _id: faker.string.uuid(),
            originCoordinates: {
              lat: faker.location.latitude(),
              lng: faker.location.longitude(),
            },
            destinationCoordinates: {
              lat: faker.location.latitude(),
              lng: faker.location.longitude(),
            },
            distance: getRandomNumber({ min: 10, max: 500 }),
            timeShipping: faker.string.alphanumeric(10),
            timeFlight: faker.string.alphanumeric(10),
            deliveryDateShipping: faker.date.future().toISOString(),
            deliveryDateFlight: faker.date.future().toISOString(),
          },
        },
      ],
      shipping_destination: {
        _id: faker.string.uuid(),
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipcode: faker.location.zipCode(),
        phone_number: faker.phone.number(),
      },
      total_amount: getRandomNumber({ min: 50, max: 500 }),
      payment_id: faker.string.uuid(),
      payment_status: ["pending", "completed", "failed"][
        getRandomNumber({ min: 0, max: 2 })
      ],
      order_status: "processing",
      order_location: [
        {
          country: faker.location.country(),
          state: faker.location.state(),
          city: faker.location.city(),
          address: faker.location.streetAddress(),
          zip_code: faker.location.zipCode(),
          order_status: "processing",
        },
      ],
    });
  }
};

// Helper function to generate Service Orders
const generateServiceOrders = async (users, services) => {
  for (let i = 0; i < 5; i++) {
    const randomBuyer = users[Math.floor(Math.random() * users.length)];
    const randomService =
      services[getRandomNumber({ min: 0, max: services.length - 1 })];

    await ServiceOrder.create({
      buyer: {
        id: randomBuyer._id,
        username: randomBuyer.username,
        email: randomBuyer.email,
      },
      service_id: randomService._id,
      order_id: faker.string.alphanumeric(6),
      service_details: {
        name: randomService.name,
        description: randomService.description,
        owner: randomService.owner,
        price: randomService.price,
        status: randomService.status,
        image: randomService.image,
      },
      order_status: "pending",
      payment_status: ["pending", "completed", "failed"][
        getRandomNumber({ min: 0, max: 2 })
      ],
      total_amount: randomService.price,
      payment_id: faker.string.uuid(),
      shipping_details: {
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        zipcode: faker.location.zipCode(),
        phone_number: faker.phone.number(),
      },
    });
  }
};

// Main function to generate Product Orders and Service Orders
const generateOrders = async (users, products, services) => {
  try {
    // Generate Product Orders
    await generateProductOrders(users, products);

    // Generate Service Orders
    await generateServiceOrders(users, services);

    console.log("Product and Service Orders generation completed!");
  } catch (error) {
    console.error("Error generating orders:", error);
  }
};

// Main function to generate data
const generateData = async () => {
  try {
    // MongoDB connection
    await connectDB();
    console.log("Connected to MongoDB");

    // Generate Users first
    const users = await generateUsers();

    // Then generate Categories
    await generateCategories();

    // Generate GroupChats and GroupMemberships
    await generateGroupChatsAndMemberships(users);

    // Generate Products and Services
    const products = await generateProducts();
    const services = await generateServices();

    // Generate Product Orders and Service Orders
    await generateOrders(users, products, services);

    console.log("Data generation completed!");
  } catch (error) {
    console.error("Error generating data:", error);
  } finally {
    mongoose.disconnect();
  }
};

// Run the data generation
generateData();
