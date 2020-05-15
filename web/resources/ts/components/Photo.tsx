import React from "react";
import {Photo as PhotoType} from "../types/Photo";
import {Link} from "react-router-dom";

type PhotoProp = {
  photo: PhotoType;
  onLike: (id: string, liked: boolean) => void;
  className?: string;
}

const Photo: React.FC<PhotoProp> = ({photo, onLike, className}) => {

  const handleOnClickDownloadLink = (event) => {
    event.preventDefault();
    window.location.href = `/photos/${photo.id}/download`;
  }

  const handleOnClickLike = (event: React.MouseEvent) => {
    event.preventDefault();
    onLike(photo.id, photo.liked_by_user);
  }

  return (
    <div className={`photo ${className}`}>
      <figure className="photo__wrapper">
        <img
          className="photo__image"
          src={photo.url}
          alt={`Photo by ${photo.owner.name}`}
        />
      </figure>
      <Link className={"photo__overlay"} to={`/photos/${photo.id}`} title={`View the photo by ${photo.owner.name}`}>
        <div className="photo__controls">
          <button
            className={`photo__action photo__action--like ${photo.liked_by_user ? "photo__action--liked" : ""}`}
            title="Like photo"
            onClick={handleOnClickLike}
          >
            <i className="icon ion-md-heart"/>{photo.likes_count}
          </button>
          <div
            className="photo__action"
            title="Download photo"
            onClick={handleOnClickDownloadLink}
          >
            <i className="icon ion-md-arrow-round-down"/>
          </div>
        </div>
        <div className="photo__username">
          {photo.owner.name}
        </div>
      </Link>
    </div>
  );
}

export default Photo;
