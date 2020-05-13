import React from "react";
import {Link} from "react-router-dom";

type PaginationProp = {
  currentPage: number;
  lastPage: number;
}

const Pagination: React.FC<PaginationProp> = ({currentPage, lastPage}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === lastPage;
  return (
    <div className="pagination">
      {isFirstPage || <Link to={`/?page=${currentPage - 1}`} className="button">&laquo; prev</Link>}
      {isLastPage || <Link to={`/?page=${currentPage + 1}`} className="button">next &raquo;</Link>}
    </div>
  );
}

export default Pagination;
