import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Http from "../utils/Http";
import {CREATED, UNPROCESSABLE_ENTITY} from "../const/ResposeCode";
import {useDispatch} from "react-redux";
import {setErrorCode} from "../store/error";
import Loader from "./Loader";
import {setMessage} from "../store/message";

type PhotoFormProp = {
  open: boolean;
  onClose: () => void;
}

type PhotoErrorMessages = { photo: string[] };

const PhotoForm: React.FC<PhotoFormProp> = ({open, onClose}) => {

  const [preview, setPreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<PhotoErrorMessages | null>(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    setPhoto(null);
    setPreview(null);
  }, [open])

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
  }

  const handleOnChangeFileInput = (event: ChangeEvent<HTMLInputElement>) => {

    if (!event.target.files) {
      setPhoto(null);
      setPreview(null);
      return false;
    }

    if (event.target.files.length === 0) {
      setPhoto(null);
      setPreview(null);
      return false;
    }

    if (!event.target.files[0].type.match("image.*")) {
      setPhoto(null);
      setPreview(null);
      return false;
    }

    const reader = new FileReader();

    reader.onload = e => {
      if (!e.target) {
        setPhoto(null);
        setPreview(null);
        return false;
      }
      if (typeof e.target.result === "string") {
        setPreview(e.target.result);
      }
    }

    reader.readAsDataURL(event.target.files[0]);
    setPhoto(event.target.files[0]);
  }

  const handleOnClickSubmitButton = async () => {

    if (!photo) {
      return false;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("photo", photo);

    const res = await Http.post("/api/photos", formData);

    setLoading(false);

    if (res.status === UNPROCESSABLE_ENTITY) {
      setErrors(res.data.errors);
      return false
    }

    if (res.status !== CREATED) {
      dispatch(setErrorCode(res.status));
      onClose();
      return false
    }

    onClose();

    dispatch(setMessage("写真が投稿されました！"));

    history.push(`/photos/${res.data.id}`);
  }

  return open ? (
    <div className="photo-form">
      <h2 className="title">Submit a photo</h2>
      {
        loading ? (
          <Loader />
        ) : (
          <form className="form" onSubmit={handleOnSubmit}>
            {
              errors && (
                <div className="errors">
                  <ul>
                    {errors.photo.map(msg => <li key={msg}>{msg}</li>)}
                  </ul>
                </div>
              )
            }
            <input className="form__item" type="file" onChange={handleOnChangeFileInput}
                   accept=".png,.jpg,.jpeg,.svg,.gif"/>
            {
              preview && (
                <output className="form__output">
                  <img src={preview} alt="upload file"/>
                </output>
              )
            }
            <div className="form__button">
              <button className="button button--inverse" onClick={handleOnClickSubmitButton}>submit</button>
            </div>
          </form>
        )
      }
    </div>
  ) : (
    <></>
  )
}

export default PhotoForm;
