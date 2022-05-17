import React, { useState, useContext, useEffect } from "react";
import Slider from "@material-ui/core/Slider";
import { ObjectContext } from "./EditingPage";
import "./Slider.css";

export const SliderComponent = (props) => {
  const [currentSlide, setCurrentSlide] = useState(props.value);
  const { disPatchObjects, selection } = useContext(ObjectContext);

  const valueToChange = props.name;


  useEffect(() => {
    setCurrentSlide(props.value);
  }, [props.value]);

  const changeValue = (event, newValue) => {
    setCurrentSlide(newValue);
    disPatchObjects({
      type: "update",
      nameToFind: selection.name,
      valueToChange: valueToChange,
      currentSlide: currentSlide,
    });
  };

  return !props.marks ? (
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
