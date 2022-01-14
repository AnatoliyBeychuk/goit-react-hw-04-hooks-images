import { useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { Overlay, ModalContainer } from "./Modal.styled";

const modalRoot = document.querySelector("#modal-root");

function Modal({ image, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]); //onClose постоянное

  const handleBackdropClick = (event) => {
    if (event.currentTarget === event.target) onClose();
  };

  return createPortal(
    <Overlay onClick={handleBackdropClick}>
      <ModalContainer>
        <img src={image} alt="" />
      </ModalContainer>
    </Overlay>,
    modalRoot
  );
}

Modal.propTypes = {
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
