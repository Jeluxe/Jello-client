import { Overlay } from "..";
import { ModalDataTypes, ModalTypes } from "../../types/global";
import CardModal from "./CardModal/CardModal";
import ContainerModal from "./ContainerModal/ContainerModal";
import "./Modal.css";
import ThemeModal from "./ThemeModal/ThemeModal";

type ModalProps = {
  isModalOpen: boolean,
  setIsModalOpen: React.Dispatch<boolean>,
  modalType: ModalTypes,
  modalData?: ModalDataTypes,
}

const Modal = ({ isModalOpen, setIsModalOpen, modalType, modalData }: ModalProps) => {
  const fetchModal = () => {
    if (modalType !== "theme" && !modalData) return;

    switch (modalType) {
      case "card":
        return <CardModal modalData={modalData} />;
      case "container":
        return <ContainerModal modalData={modalData} />;
      case "theme":
        return <ThemeModal />;
      default:
        console.log("ERROR");
    }
  }

  return (
    <Overlay clickable isVisible={isModalOpen} setIsVisible={() => setIsModalOpen(false)}>
      <div className="modal">
        {fetchModal()}
      </div>
    </Overlay >
  )
}

export default Modal