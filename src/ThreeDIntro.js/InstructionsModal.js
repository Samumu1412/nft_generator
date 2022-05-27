import * as React from 'react';
import { Backdrop, Box, Modal, Fade } from '@material-ui/core';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  height: 650,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '10px',
  p: 4,
  backgroundColor: '#525050d7',
};

export const FAQModalComponent = ({ isOpen, handleClose }) => {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            <p style={{ color: '#fff', fontFamily: 'monospace' }}>
              This is a instructions project
            </p>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

FAQModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
