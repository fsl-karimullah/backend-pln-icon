const express = require("express");
const app = express();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const AdminJSMongoose = require("@adminjs/mongoose");
const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const User = require("./models/User");
const Items = require("./models/Items");
const ItemType = require("./models/ItemType");
const Partner = require("./models/Partner");
// connectDB();
app.use(express.json());
const PORT = process.env.PORT || 5000;

//auth
const DEFAULT_ADMIN = {
  email: "admin@gmail.com",
  password: "123456",
};

const authenticate = async () => {
  return { email: DEFAULT_ADMIN.email };
};
//database
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

//funtion to start app
const start = async () => {
  const app = express();
  const db = await mongoose.connect(
    "mongodb://localhost:27017/pln-iconplus-databases"
  );

  const usersNavigation = {
    name: "Users",
    icon: "User",
  };
  const itemsNavigation = {
    name: "Items",
    icon: "Items",
  };
  const itemTypeNavigation = {
    name: "Item Type",
    icon: "Type",
  };
  const PartnerNavigation = {
    name: "Partner",
    icon: "Partner",
  };

  const admin = new AdminJS({
    resources: [
      {
        resource: User,
        options: {
          navigation: usersNavigation,
        },
      },
      {
        resource: Items,
        options: {
          navigation: itemsNavigation,
        },
      },
      {
        resource: ItemType,
        options: {
          navigation: itemTypeNavigation,
        },
      },
      {
        resource: Partner,
        options: {
          navigation: PartnerNavigation,
        },
      },
    ],
  });
  const secret = "very_secret_secret";
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: "very_secret_secret",
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret,
    }
  );
  app.use(admin.options.rootPath, adminRouter);

  app.listen(PORT, () => {
    console.log(
      `AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`
    );
  });
};

// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }
app.use("/api/users", require("./routes/api/auth/users"));
app.use("/api/auth", require("./routes/api/auth/auth"));
app.use("/api/items", require("./routes/api/items/items"));
app.use("/api/item", require("./routes/api/items/item"));
app.use("/api/partner", require("./routes/api/partner/partner"));
app.use("/api/type", require("./routes/api/items/type"));

start();
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
