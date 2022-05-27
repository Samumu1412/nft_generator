import React, { useContext, useRef, useEffect } from 'react';
import { SliderComponent } from './Slider';
import { ObjectContext } from './EditingPage';
import PropTypes from 'prop-types';

export const Editor = ({ currentValues }) => {
  const { objects, selection } = useContext(ObjectContext);

  const commonStyle = {
    margin: '10px',
    backgroundColor: '#c1c9d1',
    padding: '5px',
    borderRadius: '10px',
    boxShadow: '1px 3px 1px #afafaf',
    fontWeight: 'bolder',
    fontFamily: 'monospace',
  };

  const identicalValues = useRef(
    currentValues.find((obj) => obj.name === selection.name)
  );

  useEffect(() => {
    identicalValues.current =
      objects && objects.find((obj) => obj.name === selection.name);
  }, [objects, selection.name]);

  return (
    <div
      style={{
        backgroundColor: '#dee2e7',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '1px 3px 1px #acacaf',
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
        Editor
      </div>

      <div style={commonStyle}>
        Height:
        <SliderComponent
          name={'height'}
          value={currentValues.length ? currentValues[0].height : 0}
        />
      </div>
      <div style={commonStyle}>
        Width:
        <SliderComponent
          name={'width'}
          value={currentValues.width ? currentValues[0].width : 0}
        />
      </div>
      <div style={commonStyle}>
        Depth:
        <SliderComponent
          marks={true}
          name={'depth'}
          value={currentValues.depth ? currentValues[0].depth : 0}
        />
      </div>
      {/* <div style={commonStyle}>
        Rarity:
        <SliderComponent
          marks={true}
          name={"rarity"}
          value={currentValues.rarity ? currentValues[0].rarity : 0}
        />
      </div> */}
    </div>
  );
};

Editor.propTypes = {
  currentValues: PropTypes.array.isRequired,
};
