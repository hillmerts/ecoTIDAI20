import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ConfirmacionProps {
    error?: boolean;
    show: boolean;
    handleCancel: () => void;
    handleConfirm: () => void;
    encabezado: string,
    mensaje: string;
}

const ConfirmacionModal: FC<ConfirmacionProps> = ({
    show,
    handleCancel,
    handleConfirm,
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
        <Button variant='primary' onClick={handleConfirm}>
            Confirmar
          </Button>
          <Button variant='secondary' onClick={handleCancel}>
            Cancelar
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default observer(ConfirmacionModal);