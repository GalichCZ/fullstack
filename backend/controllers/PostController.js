import { validationResult } from "express-validator";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("user", "fullName avatarUrl")
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't resolve",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      { $inc: { viewsCount: 1 } },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Oops, somthing goes wrong..." });
        }
        if (!doc) {
          return res.status(404).json({ message: "Can't find this post" });
        }
        res.setHeader("Content-Type", "image/jpeg");
        res.json(doc);
      }
    )
      .populate("user", "fullName avatarUrl")
      .exec();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't resolve",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Oops, something goes wrong..." });
        }

        if (!doc)
          return res.status(404).json({ message: "Can't find this post" });

        res.json({ message: "Post deleted !" });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't resolve",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't resolve",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't resolve",
    });
  }
};
