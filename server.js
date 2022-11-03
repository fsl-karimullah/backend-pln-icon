const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();
app.use(express.json());

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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
