import React from "react";
import {Photo as PhotoType} from "../types/Photo";
import {Link} from "react-router-dom";

type PhotoProp = {
  photo: PhotoType;
  className?: string;
}

const Photo: React.FC<PhotoProp> = ({photo, className}) => {

  const handleOnClickDownloadLink = (event) => {
    event.preventDefault();
    window.location.href = `/photos/${photo.id}/download`;
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
            className="photo__action photo__action--like"
            title="Like photo"
          >
            <i className="icon ion-md-heart"/>12
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
