import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface MensajeProps {
    error?: boolean;
    show: boolean;
    handleClose: () => void;
    encabezado: string,
    mensaje: string;
}

const MensajeModal: FC<MensajeProps> = ({
    error,
    show,
    handleClose,
    encabezado,
    mensaje,
}) => {
  return (
    <Modal show={show}>
        <Modal.Header>
          <Modal.Title>{encabezado}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{mensaje}</Modal.Body>
        <Modal.Footer>
          <Button variant={error ? "danger": "primary"} onClick={handleClose}>
            {error ? "Corregir" : "Aceptar"}
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default observer(MensajeModal);