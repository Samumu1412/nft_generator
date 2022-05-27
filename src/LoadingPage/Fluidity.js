import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavComponent } from '../EditingPage/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@material-ui/core';

import './style.css';
import { FinalModalComponent } from './finalModal';

export const Fluidity = () => {
  const [loading, setLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [finalModal, setFinalModal] = useState(false);

  const handleClickGenerate = async () => {
    const baseURL = 'http://localhost:8443/compress';
    setLoading(true);
    await axios
      .get(baseURL, {
        params: { uuid: JSON.parse(sessionStorage.uuid) },
      })
      .then(function () {
        setLoading(false);
        setIsUploaded(true);
        toast.success('Compresssion success');
      })
      .catch(function (error) {
        toast.info(error);
        toast.error('Compression fail');
      });
  };

  //TBD: Handling download & delete local files

  useEffect(() => {
    if (isUploaded) {
      axios
        .get('http://localhost:8443/resolveFiles', {
          params: { uuid: JSON.parse(sessionStorage.uuid) },
        })
        .then(function () {
          setFinalModal(true);
        })
        .catch(function (error) {
          window.location.href = '/final';
          toast.info(error);
          toast.error('Something went wrong!');
        });
    }
  }, [isUploaded]);

  const handleClose = () => {
    const data = {
      uuid: JSON.parse(sessionStorage.uuid),
    };
    axios.post('http://localhost:8443/deleteLocalFiles', data);
    setFinalModal(false);
  };

  return (
    <div className="trans">
      <div style={{ maxHeight: '20px', zIndex: 21 }}>
        <NavComponent />
      </div>

      <div
        style={{
          background: '#00000000',
          paddingTop: '50vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          className="typewriter"
          style={{
            maxWidth: '71vw',
            maxHeight: '8vh',
          }}
        >
          <h2>Patience ... Awesome things on the way !&nbsp; </h2>
        </div>
      </div>
      <div
        style={{
          justifyContent: 'center',
          display: 'flex',
          marginTop: '50px',
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleClickGenerate}
          disabled={loading}
        >
          Generate Link
        </Button>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '2vh' }}
      >
        {loading && (
          <div className="spinner-box">
            <div className="configure-border-1">
              <div className="configure-core"></div>
            </div>
            <div className="configure-border-2">
              <div className="configure-core"></div>
            </div>
          </div>
        )}
      </div>
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
      <div>
        <FinalModalComponent isOpen={finalModal} handleClose={handleClose} />
      </div>
    </div>
  );
};
