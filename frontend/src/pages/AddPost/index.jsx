import React, { useCallback, useEffect, useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import axios from "../../axios";
export const AddPost = () => {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const inputFile = useRef(null);

  const navigate = useNavigate();

  const handleChangeFile = async (e) => {
    console.log(e.target.files);
    const options = {
      headers: { "Content-Type": "image/jpeg" },
    };
    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const { data } = await axios.post("/upload", formData, options);
      console.log(data);
      setImageUrl(data.url);
    } catch (error) {
      console.log(error);
      alert("Error while file uploading");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags);
          setImageUrl(data.imageUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    const options = {
      headers: { "Content-Type": "image/jpeg" },
    };

    try {
      setIsLoading(true);
      const fields = {
        title,
        tags,
        text,
        imageUrl,
      };
      const { data } = await axios.post("/posts", fields, options);

      const id = data._id;

      navigate(`/posts/${id}`);
    } catch (error) {
      console.warn(error.response);
      alert("Error while creating post");
    }
  };

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token")) return <Navigate to="/" />;
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFile.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input ref={inputFile} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => {
          setTags(e.target.value);
        }}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
