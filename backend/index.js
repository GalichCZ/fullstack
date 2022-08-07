import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth.js";
import cors from "cors";
import { loginValidation, registerValidator } from "./validations/auth.js";
import {
  getME,
  login,
  register,
  userList,
} from "./controllers/UserController.js";
import { postCreateValidation } from "./validations/post.js";
import {
  create,
  getAll,
  getOne,
  deletePost,
  updatePost,
  getLastTags,
} from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect(
    "mongodb+srv://admin:B7mrX4CeNWUtDEh2@cluster0.hfbpn.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB ERR", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("HEllo");
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post("/auth/register", registerValidator, handleValidationErrors, register);
app.get("/auth/me", checkAuth, getME);
app.get("/users", handleValidationErrors, userList);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});

app.get("/posts/tags", handleValidationErrors, getLastTags);
app.get("/tags", handleValidationErrors, getLastTags);

app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  create
);
app.delete("/posts/:id", checkAuth, deletePost);
app.patch("/posts/:id", checkAuth, handleValidationErrors, updatePost);

app.listen(4444, (err) => {
  if (err) return console.log(err);

  console.log("server OK");
});
