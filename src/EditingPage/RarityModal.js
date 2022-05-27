import * as React from 'react';
import { Backdrop, Box, Modal, Fade } from '@material-ui/core';
import PropTypes from 'prop-types';

import TreesTempRarity from './FolderStructureRarity';
import '../style.css';

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

export const RarityModalComponent = ({
  isOpen,
  handleClose,
  folderStructure,
}) => {
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
              style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                maxHeight: '550px',
              }}
            >
              <TreesTempRarity folderData={folderStructure} />
            </div>

            <div
              style={{
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              <button
                className="transparent-button"
                style={{ margin: 10 }}
                onClick={handleClose}
              >
                Submit
              </button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

RarityModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  folderStructure: PropTypes.object,
};
