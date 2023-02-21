import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Items from "./Items";

const Pagination = (props) => {
  const [items, setItems] = useState([]);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + props.perpage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / props.perpage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * props.perpage) % items.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setItems(props.data);
  }, [props.data]);

  return (
    <>
      <Items
        currentItems={currentItems}
        uid={props.id}
        result={setItems}
        userInfo={props.userInfo}
        del={props.del}
        delID={props.delID}
      />
      <div className="navigation">
        <ReactPaginate
          breakLabel="..."
          nextLabel="next>"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<previous"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  );
};

export default Pagination;
