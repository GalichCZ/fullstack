import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Insert post title").isLength({ min: 3 }).isString(),
  body("text", "Type post text").isLength({ min: 10 }).isString(),
  body("tags", "Wrong tags type").optional().isString(),
  body("imageUrl", "Wrong URL type").optional().isString(),
];
