import Pagination from "react-bootstrap/Pagination";
import { useEffect, useState } from "react";
import { number } from "yup";

function Pagina({ size, count, limit, page, setPage }) {
  const [numberOfPage, setNumberOfPage] = useState(0);

  function pagination(c, m) {
    let current = c,
      last = m,
      delta = 2,
      left = current - delta,
      right = current + delta + 1,
      l;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  }

  useEffect(() => {
    const numberOfPage = Math.ceil(count / limit);
    setNumberOfPage(numberOfPage);
  }, [limit, count]);

  const getPage = (page) => {
    setPage(page);
  };

  const handleChangePage = (num) => {
    if (num === 1 && page > 1) return setPage(page - 1);

    if (num === 2 && page < numberOfPage) return setPage(page + 1);
  };

  const handleSetPage = (num) => {
    if (num === 1 && page > 1) return setPage(1);

    if (num === 2 && page < numberOfPage) return setPage(numberOfPage);
  };
  return (
    <Pagination size={size} className="mb-0">
      <Pagination.First
        disabled={page === 1}
        onClick={() => handleSetPage(1)}
      />
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => handleChangePage(1)}
      />
      {pagination(page, numberOfPage).map((item) => {
        return (
          <Pagination.Item
            active={page === item}
            disabled={item === "..."}
            onClick={() => getPage(item)}
            key={item}
          >
            {item}
          </Pagination.Item>
        );
      })}
      <Pagination.Next
        disabled={page === numberOfPage}
        onClick={() => handleChangePage(2)}
      />
      <Pagination.Last
        disabled={page === numberOfPage}
        onClick={() => handleSetPage(2)}
      />
    </Pagination>
  );
}

export default Pagina;
