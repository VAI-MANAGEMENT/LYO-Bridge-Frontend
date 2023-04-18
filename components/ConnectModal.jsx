import React, { useContext } from "react";
import Modal from "react-bootstrap/Modal";

const ConnectModal= ({}) => {
    const [show, setShow] = useState(false); 
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Modal show={show} onHide={handleClose} className="connect-modal">
    <Modal.Header closeButton>
      <Modal.Title>ROI Calculator</Modal.Title>
    </Modal.Header>
    <Modal.Body>
     
   <h1>testign</h1>
    

     
    </Modal.Body>
  </Modal>
  );
}

export default ConnectModal;
