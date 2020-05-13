import React, {useEffect, useState} from "react";
import Photo from "../components/Photo";
import {Photo as PhotoType} from "../types/Photo";
import Http from "../utils/Http";
import {OK} from "../const/ResposeCode";
import {useDispatch} from "react-redux";
import {setErrorCode} from "../store/error";
import Pagination from "../components/Pagination";
import {useLocation} from "react-router-dom";

const PhotoList = () => {

  const [photoList, setPhotoList] = useState([] as PhotoType[]);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);

  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const page = query.get("page") || "1";

  useEffect(() => {
    fetchPhotos();
    window.scrollTo(0, 0);
  }, [page]);

  const fetchPhotos = async () => {
    const response = await Http.get(`/api/photos/?page=${page}`);

    if (response.status !== OK) {
      dispatch(setErrorCode(response.status));
      return false
    }

    setPhotoList(response.data.data);
    setCurrentPage(response.data.current_page);
    setLastPage(response.data.last_page);
  }

  return (
    <div className="photo-list">
      <div className="grid">
        {
          photoList.map(photo => (
            <Photo photo={photo} className="grid__item" key={photo.id}/>
          ))
        }
      </div>
      <Pagination currentPage={currentPage} lastPage={lastPage} />
    </div>
  );
}

export default PhotoList;
