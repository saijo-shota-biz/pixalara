import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Http from "../utils/Http";
import {CREATED, OK, UNPROCESSABLE_ENTITY} from "../const/ResposeCode";
import {setErrorCode} from "../store/error";
import {useDispatch, useSelector} from "react-redux";
import {Photo} from "../types/Photo";
import {isLoginSelector} from "../store/auth";

const PhotoDetail = () => {

  const isLogin = useSelector(isLoginSelector);

  const [photo, setPhoto] = useState(null as Photo | null);
  const [fullWidth, setFullWidth] = useState(false);

  // comment form
  const [content, setContent] = useState("");
  const [commentApiErrors, setCommentApiError] = useState([]);

  const {id} = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPhoto();
  }, [id]);

  const fetchPhoto = async () => {
    const response = await Http.get(`/api/photos/${id}`);
    if (response.status !== OK) {
      dispatch(setErrorCode(response.status));
      return false
    }

    setPhoto(response.data);
  }

  const handleOnClick = () => {
    setFullWidth(state => !state);
  };

  const handleOnChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  }

  const handleOnSubmitComment = (event: FormEvent) => {
    event.preventDefault();
  }

  const handleOnClickAddComment = async () => {
    const response = await Http.post(`/api/photos/${id}/comments`, {content});

    if (response.status === UNPROCESSABLE_ENTITY) {
      setCommentApiError(response.data.errors.content);
      return false
    }

    setContent("");
    setCommentApiError([]);

    if (response.status !== CREATED) {
      dispatch(setErrorCode(response.status));
      return false
    }

    fetchPhoto();
  }

  const handleOnClickLike = async () => {
    if (!isLogin) {
      alert('いいね機能を使うにはログインしてください。');
      return false;
    }

    let res;
    if (photo && photo.liked_by_user) {
      res = await Http.delete(`/api/photos/${id}/like`);
    } else {
      res = await Http.put(`/api/photos/${id}/like`);
    }

    if (res.status !== OK) {
      dispatch(setErrorCode(res.status));
      return false;
    }

    fetchPhoto();
  }

  const like = () => {

  }

  const unlike = () => {}

  return photo ? (
    <div className={`photo-detail ${fullWidth ? "photo-detail--column" : ""}`}>
      <figure className="photo-detail__pane photo-detail__image" onClick={handleOnClick}>
        <img src={photo.url} alt={`Posted by ${photo.owner.name}`}/>
        <figcaption>Posted by {photo.owner.name}</figcaption>
      </figure>
      <div className="photo-detail__pane">
        <button className={`button button--like ${photo.liked_by_user ? "button--liked" : ""}`} title="Like photo"
                onClick={handleOnClickLike}>
          <i className="icon ion-md-heart"/>{photo.likes_count}
        </button>
        <a
          href={`/photos/${photo.id}/download`}
          className="button"
          title="Download photo"
        >
          <i className="icon ion-md-arrow-round-down"/>Download
        </a>
        <h2 className="photo-detail__title">
          <i className="icon ion-md-chatboxes"/>Comments
        </h2>
        {
          photo.comments.length > 0 ? (
            <ul className="photo-detail__comments">
              {
                photo.comments.map((comment) => (
                  <li className="photo-detail__commentItem" key={comment.content}>
                    <p className="photo-detail__commentBody">
                      {comment.content}
                    </p>
                    <p className="photo-detail__commentInfo">
                      {comment.author.name}
                    </p>
                  </li>
                ))
              }
            </ul>
          ) : <p>No comments yet.</p>
        }
        {
          isLogin && (
            <form className="form" onSubmit={handleOnSubmitComment}>
              {
                commentApiErrors.length > 0 && (
                  <div className="errors">
                    <ul>
                      {
                        commentApiErrors.map((error) => (
                          <li key={error}>{error}</li>
                        ))
                      }
                    </ul>
                  </div>
                )
              }
              <textarea className="form__item" value={content} onChange={handleOnChangeContent}/>
              <div className="form__button">
                <button className="button button--inverse" onClick={handleOnClickAddComment}>submit comment</button>
              </div>
            </form>
          )
        }
      </div>
    </div>
  ) : <></>;
}

export default PhotoDetail;
