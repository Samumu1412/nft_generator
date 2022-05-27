import React, { useCallback, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { map, assign } from 'lodash';
import PropTypes from 'prop-types';

const commonStyle = {
  margin: '10px',
  backgroundColor: '#c1c9d1',
  padding: '5px',
  borderRadius: '10px',
  boxShadow: '1px 3px 1px #afafaf',
};

export const EditorInput = ({ layers, setValues }) => {
  const [height, setHeight] = useState(500);
  const [width, setWidth] = useState(500);
  const [copyAmount, setCopyAmount] = useState(100);
  const [orderInput, setOrderInput] = useState(layers);

  const handleFinalClick = useCallback(() => {
    return copyAmount > 10000
      ? null
      : setValues({
          height,
          width,
          copyAmount,
          layerOrder: orderInput,
        });
  }, [height, width, copyAmount, orderInput, setValues]);

  return (
    <div
      style={{
        marginTop: '10px',
        backgroundColor: '#dee2e7',
        padding: '7px',
        borderRadius: '10px',
        boxShadow: '1px 3px 1px #acacaf',
        height: '80vh',
        overflow: 'scroll',
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
        Manual Input
      </div>
      <div style={commonStyle}>
        <div style={{ fontWeight: 'bolder', fontFamily: 'monospace' }}>
          Height:
        </div>
        <div>
          <TextField
            size="small"
            variant="standard"
            inputProps={{ style: { textAlign: 'center' } }}
            placeholder="(in px)"
            onChange={(event) => {
              setHeight(JSON.parse(event.target.value));
            }}
            onBlur={handleFinalClick}
          />
        </div>
      </div>
      <div style={commonStyle}>
        <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          Width:
        </div>

        <TextField
          size="small"
          variant="standard"
          inputProps={{ style: { textAlign: 'center' } }}
          placeholder="(in px)"
          onChange={(event) => {
            setWidth(JSON.parse(event.target.value));
          }}
          onBlur={handleFinalClick}
        />
      </div>

      <div style={commonStyle}>
        <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          Total Copies:
        </div>

        <TextField
          size="small"
          defaultValue={100}
          inputProps={{ min: 0, style: { textAlign: 'center' } }}
          margin="dense"
          variant="outlined"
          onChange={(event) => {
            setCopyAmount(JSON.parse(event.target.value));
          }}
          error={copyAmount > 10000}
          helperText={copyAmount > 10000 ? 'Should be less than 10000' : ''}
          onBlur={handleFinalClick}
        />
      </div>
      {map(layers, (layerName, index) => {
        return (
          <div style={commonStyle} key={layerName}>
            <div style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
              {layerName}
            </div>

            <TextField
              size="small"
              defaultValue={index}
              inputProps={{ min: 0, style: { textAlign: 'center' } }}
              margin="dense"
              variant="outlined"
              onChange={(event) => {
                setOrderInput((layerOrder) => {
                  return assign(layerOrder, {
                    [layerName]: event.target.value,
                  });
                });
              }}
              onBlur={handleFinalClick}
            />
          </div>
        );
      })}
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Button variant="contained" color="primary" onClick={handleFinalClick}>
          Submit
        </Button>
      </div>
    </div>
  );
};

EditorInput.propTypes = {
  layers: PropTypes.array.isRequired,
  setValues: PropTypes.func.isRequired,
};
