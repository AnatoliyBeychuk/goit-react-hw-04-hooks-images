import "./App.css";
import { useState, useEffect, useRef } from "react";
import Searchbar from "./components/Searchbar/Searchbar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Button from "./components/Button/Button";
import PixabayAPI from "./components/service/PixabayAPI";
import Modal from "./components/Modal/Modal";
import Loader from "./components/Loader/Loader";

function App() {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    loadImages(query);
  }, [query, page]);

  const loadImages = (query) => {
    setStatus("pending");
    PixabayAPI.load(query)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(new Error("Произошла ошибка :("));
      })
      .then((data) => {
        if (data.total === 0) {
          return Promise.reject(new Error("Ничего не найдено :("));
        }
        setImages((images) => [...images, ...data.hits]);
        setTotal(data.total);
        setStatus("resolved");
      })
      .catch((error) => {
        setError(error);
        setStatus("rejected");
      });
  };

  const toggleModal = () => {
    setShowModal((showModal) => !showModal);
  };

  const handleSelectedImage = (url) => {
    setSelectedImage(url);
  };

  const onSearch = (query) => {
    setImages([]);
    setQuery(query);
    setPage(PixabayAPI.resetPage());
  };

  const onLoadMore = () => {
    setPage(PixabayAPI.nextPage());
  };

  const hasNextPage = images.length === total;

  return (
    <>
      <Searchbar onSubmit={onSearch} />
      {status === "idle" && (
        <h1>Воспользуйтесь поиском, чтобы найти нужную картинку!</h1>
      )}
      <ImageGallery
        dataImg={images}
        onOpenModal={toggleModal}
        onSelectImage={handleSelectedImage}
      />
      {!hasNextPage && status === "resolved" && <Button onClick={onLoadMore} />}
      {showModal && <Modal image={selectedImage} onClose={toggleModal} />}
      {status === "rejected" && <h1>{error.message}</h1>}
      {status === "pending" && <Loader />}
    </>
  );
}

export default App;
