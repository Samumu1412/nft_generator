import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Fade,
  TextField,
  Backdrop,
  Box,
  Modal,
} from '@material-ui/core';
import axios from 'axios';

import { ObjectContext } from './EditingPage';
import { ToastContainer } from 'react-toastify';
import { DemoCarousel } from './Carousel';

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

export const ModalComponent = ({
  canvasHeight,
  canvasWidth,
  openLoadingModal,
  handleClose,
  isOpen,
}) => {
  const { objects, numberOfCopies, tree, layerOrder } =
    useContext(ObjectContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [URL, setURL] = useState('');
  const [next, setNext] = useState(false);

  const handleClick = () => {
    const data = {
      objects: objects,
      total: numberOfCopies,
      uuid: JSON.parse(sessionStorage.uuid),
      canvasHeight: canvasHeight,
      canvasWidth: canvasWidth,
      folderTree: tree,
      name: name,
      description: description,
      URL: URL,
      layerOrder,
    };
    openLoadingModal();
    axios
      .post('http://localhost:8443/submitDetails', data)
      .then(function (response) {
        window.location.href = '/loading';
        console.log(response);
      })
      .catch(function (error) {
        window.location.href = '/error';
        console.log(error);
      });
  };

  const handleFormSubmit = () => {
    setNext(true);
  };

  const handleModalClose = () => {
    setNext(false);
    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isOpen}>
          <Box sx={style}>
            {!next && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.336)',
                  padding: '10px',
                  borderRadius: '20px',
                }}
              >
                <div
                  style={{
                    justifyContent: 'center',
                    display: 'flex',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    fontFamily: 'monospace',
                  }}
                >
                  REVIEW
                </div>
                <div
                  style={{
                    justifyContent: 'flex-start',
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: 500,
                    fontFamily: 'monospace',
                    marginTop: '30px',
                    color: '#000',
                    marginLeft: '1%',
                  }}
                >
                  NFT Project name :
                </div>
                <TextField
                  size="medium"
                  variant="standard"
                  inputProps={{ style: { textAlign: 'center' } }}
                  placeholder="name"
                  onBlur={(event) => {
                    setName(event.target.value);
                  }}
                  style={{
                    justifyContent: 'flex-start',
                    display: 'flex',
                    width: '500px',
                    marginLeft: '10px',
                    borderRadius: '10px',
                  }}
                />
                <div
                  style={{
                    justifyContent: 'flex-start',
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: 500,
                    fontFamily: 'monospace',
                    marginTop: '30px',
                    color: '#000',
                    marginLeft: '1%',
                  }}
                >
                  External Link (Website):
                </div>
                <TextField
                  size="medium"
                  variant="standard"
                  inputProps={{ style: { textAlign: 'center' } }}
                  placeholder="URL"
                  onBlur={(event) => {
                    setURL(event.target.value);
                  }}
                  style={{
                    justifyContent: 'center',
                    display: 'flex',
                    width: '500px',
                    marginLeft: '10px',
                    borderRadius: '10px',
                  }}
                />
                <div
                  style={{
                    justifyContent: 'flex-start',
                    display: 'flex',
                    fontSize: '20px',
                    fontWeight: 500,
                    fontFamily: 'monospace',
                    marginTop: '30px',
                    color: '#000',
                    marginLeft: '1%',
                  }}
                >
                  Description :
                </div>
                <TextField
                  size="small"
                  variant="outlined"
                  inputProps={{ style: { textAlign: 'center' } }}
                  placeholder="description"
                  onBlur={(event) => {
                    setDescription(event.target.value);
                  }}
                  multiline={true}
                  style={{
                    justifyContent: 'flex-start',
                    display: 'flex',
                    width: '600px',
                    marginLeft: '10px',
                    borderRadius: '10px',
                  }}
                />

                <div
                  style={{
                    justifyContent: 'center',
                    display: 'flex',
                    marginTop: '30px',
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleFormSubmit}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {next && (
              <div>
                <DemoCarousel />
                <div
                  style={{
                    justifyContent: 'center',
                    display: 'flex',
                    marginTop: '-10px',
                  }}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleClick}
                  >
                    Create
                  </Button>
                </div>
              </div>
            )}
          </Box>
        </Fade>
      </Modal>
      <div className="form-group">
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

ModalComponent.propTypes = {
  canvasHeight: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  openLoadingModal: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
