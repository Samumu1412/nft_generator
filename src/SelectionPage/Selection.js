import React, { useCallback } from 'react';
import { NavComponent } from '../EditingPage/Navbar';

import '../style.css';
import { MyDropzone } from './Dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Selection = () => {
  const handleClick = () => {
    window.location.href = '/editing';
  };

  const [loaded, setLoaded] = React.useState(0);
  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    const folderPath = [];
    const uuid = JSON.parse(sessionStorage.uuid);
    acceptedFiles &&
      acceptedFiles.forEach((file) => {
        let path = file.path.split('/')[1];
        formData.append(`${uuid}/${path}`, file);

        const fileAdd = { path: file.path, uuid: uuid };
        folderPath.push(fileAdd);
      });

    axios
      .post('http://localhost:8443/uploadPath', folderPath)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        window.location.href = '/error';
        console.log(error);
      });

    axios
      .post('http://localhost:8443/uploadFiles', formData, {
        onUploadProgress: (ProgressEvent) => {
          setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
        },
      })
      .then(function () {
        toast.success('upload success');
      })
      .catch(function (error) {
        toast.info(error);
        toast.info('Each File should be within 10Mb limit');
        toast.info('Supported Files: jpg, jpeg, png');
        toast.error('upload fail');
      });
  }, []);

  return (
    <div>
      <NavComponent style={{ zIndex: 2 }} />
      <div className="area" style={{ zIndex: 3 }}>
        <div
          className="description-container"
          style={{ zIndex: 3, marginTop: '4vh' }}
        >
          <div className="description-header">Click below to Upload Files</div>
          <MyDropzone onDrop={onDrop} loaded={loaded} />
          <button
            className="transparent-button"
            onClick={handleClick}
            style={{ zIndex: 2 }}
            disabled={loaded !== 100}
          >
            Continue
          </button>
        </div>
      </div>
      <img
        src={require('../Assets/background.jpg')}
        alt="backgroundImage"
        className="imageBackground"
        style={{ zIndex: 1 }}
      />
    </div>
  );
};
