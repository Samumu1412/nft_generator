import React, { useContext } from 'react';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';

import { ObjectContext } from './EditingPage';
import './Items.css';

export const Items = ({
  hashedFolder,
  imageHeight,
  imageWidth,
  parent,
  onClick,
  setCoord,
}) => {
  const { objects } = useContext(ObjectContext);

  let elements = hashedFolder;
  if (objects && objects.length) {
    elements = objects;
  }

  return (
    <div>
      <div
        style={{
          height: `${imageHeight}px`,
          width: `${imageWidth}px`,
          position: 'relative',
        }}
        className="imageDimensions"
        ref={parent}
      >
        {elements &&
          elements.map((file) => (
            <div key={file.name} onClick={() => onClick(`${file.name}`)}>
              <Rnd
                style={{
                  zIndex: file.depth,
                }}
                onDragStop={(event) => {
                  setCoord(event, file);
                }}
              >
                <img
                  src={require(`.${file.path.slice(12).replaceAll('\\', '/')}`)}
                  alt="x"
                  style={{
                    width: file.width,
                    height: file.height,
                  }}
                  className="items"
                />
              </Rnd>
            </div>
          ))}
      </div>
    </div>
  );
};

Items.propTypes = {
  hashedFolder: PropTypes.array.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  parent: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  setCoord: PropTypes.func.isRequired,
};
