import * as React from 'react';
import { Backdrop, Box, Modal, Fade } from '@material-ui/core';
import PropTypes from 'prop-types';

import './loadingAnimation.css';

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

export const LoadingModalComponent = ({ isOpen, handleClose }) => {
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
            <div
              className="typewriter"
              style={{
                maxHeight: '50px',
                color: '#fff',
              }}
            >
              <h2>Files are being processed...</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="spinner-box">
                <div className="blue-orbit leo"></div>

                <div className="green-orbit leo"></div>

                <div className="red-orbit leo"></div>

                <div className="white-orbit w1 leo"></div>
                <div className="white-orbit w2 leo"></div>
                <div className="white-orbit w3 leo"></div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

LoadingModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
};
