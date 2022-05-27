import React, { useState, useContext, useEffect } from 'react';
import { Slider } from '@material-ui/core';
import { ObjectContext } from './EditingPage';
import './Slider.css';
import PropTypes from 'prop-types';

export const SliderComponent = ({ value, name, marks }) => {
  const [currentSlide, setCurrentSlide] = useState(value);
  const { disPatchObjects, selection } = useContext(ObjectContext);

  const valueToChange = name;

  useEffect(() => {
    setCurrentSlide(value);
  }, [value]);

  const changeValue = (event, newValue) => {
    setCurrentSlide(newValue);
    disPatchObjects({
      type: 'update',
      nameToFind: selection.name,
      valueToChange: valueToChange,
      currentSlide: currentSlide,
    });
  };

  return !marks ? (
    <Slider
      value={currentSlide}
      valueLabelDisplay="auto"
      onChange={changeValue}
      min={0}
      max={1000}
    />
  ) : (
    <Slider
      aria-label="Temperature"
      defaultValue={0}
      valueLabelDisplay="auto"
      value={currentSlide}
      onChange={changeValue}
      step={1}
      marks
      min={0}
      max={10}
    />
  );
};

SliderComponent.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  marks: PropTypes.bool.isRequired,
};
