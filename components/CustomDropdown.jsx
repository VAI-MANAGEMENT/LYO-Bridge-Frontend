import { RiArrowDownSLine } from "react-icons/ri";
import React, { useState, useEffect, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import { BsInfoCircle } from "react-icons/bs";

function CustomDropdown({  modalTitle, itemList, setSelectedItem, selectedItem, tokenAd, setTokenAd}) {
  const [show, setShow] = useState(false);


  const showModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    setShow(false);
  }; 
 

  return (
    <>
      <div className="dropdown-wrp input-wrp mb-3" onClick={showModal}>
        <div className="d-flex gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center">
          {selectedItem ? 
          <>
          <img src={selectedItem.imageUrl} />
            {selectedItem.name }
           </>
         : 
         "no data"
     
         }
          
           
          </div>
          <RiArrowDownSLine />
        </div>
      </div>

      <Modal
        show={show}
        onHide={() => {
          closeModal();
        }}
        className="cal-modal settingsModal modal-frame"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
            <div className="selector-assets-list">
            <ul className="asset-list">
              {itemList.length > 0 ? 
               <>
                {
                itemList.map((item, index) => (
                    <li className="item-asset" key={index}  onClick={(e)=> {setSelectedItem(item); closeModal(); setTokenAd(item.childTokenAddress) } }>
                      <div className="image">
                      <img src={item.imageUrl} />
                      </div>
                      <div className="content"> 
                        <div className="text">{item.name} </div>                   
                        <div className="name" >{item.symbol}</div>                        
                      </div>

                    </li>
                  ))
                }
               </>
                 : 
                 <div className="alert alert-info"><BsInfoCircle/> No networks avaialble</div>
                 }
              </ul>
            </div>      
        
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomDropdown;
