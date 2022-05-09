import React from "react";
import { useDropzone } from "react-dropzone";

import { ToastContainer } from "react-toastify";
import { CircularProgress } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import "react-toastify/dist/ReactToastify.css";

export function MyDropzone({ onDrop, loaded }) {

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png,image/jpg",
  });

  return (
    <div style={{
      zIndex: 2,
      padding: 20,
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ zIndex: 2 }} {...getRootProps()}>
        <input
          style={{ zIndex: 2 }}
          {...getInputProps()}
          directory=""
          webkitdirectory=""
          type="file"
        />
        {isDragActive ? (
          <p className="description-text" style={{ zIndex: 3 }}>Drop the files here ...</p>
        ) : (
          <IconButton
            aria-label="upload picture"
            component="span"
            style={{ zIndex: 2, justifyContent: "center", display: "flex", color: 'white' }}
            size="medium"
          >
            <PhotoCamera />
          </IconButton>
        )}

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
      <div
        style={{
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress style={{ color: 'white', margin: 20 }} variant="determinate" value={loaded} />
        <div className="description-text">
          {`${loaded}%`}
        </div>
      </div>
    </div>
  );
}
