import mongoose from "mongoose";

const database = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("sucessfull  Db Connected "))
    .catch((err) => console.log("error", err));
};

export default database;
