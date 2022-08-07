import { body } from "express-validator";

export const registerValidator = [
  body("email", "mail must have @xxx.xxx").isEmail(),
  body("password", "your password is shorter than 5").isLength({ min: 5 }),
  body("fullName", "name must be longer than 3").isLength({ min: 3 }),
  body("avatarUrl", "bad url").optional().isURL(),
];

export const loginValidation = [
  body("email", "mail must have @xxx.xxx").isEmail(),
  body("password", "your password is shorter than 5").isLength({ min: 5 }),
];
