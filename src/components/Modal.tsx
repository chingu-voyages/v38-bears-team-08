import React, { FunctionComponent } from 'react'
import ReactDom from 'react-dom'

type ModalProps = {
  isOpen: boolean
  children: React.ReactNode
  closeModal: () => void
}

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'aliceblue',
  padding: '20px',
  zIndex: '999',
  boxShadow: 'inset 0px 1px 22px 0px #bd70aa, 0px 1px 22px 0px #b9ff7b',
  borderRadius: 50
} as React.CSSProperties

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  zIndex: '998'
} as React.CSSProperties

const Modal: FunctionComponent<ModalProps> = ({ isOpen, children, closeModal }) => {
  if (!isOpen) return null
  return ReactDom.createPortal(
    <>
      <div style={overlayStyles} />
      <div id='modal-component' style={modalStyles}>
        {children}
        <button onClick={closeModal} className='x-btn-modal'>
          x
        </button>
      </div>
    </>,
    document.getElementById('modal') as Element
  )
}

export default Modal
