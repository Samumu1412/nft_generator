import React, { useCallback, useContext, useState, useRef } from "react";
import { forEach, keys, map } from 'lodash'

import { Items } from "./Items";
import { ObjectContext } from "./EditingPage";
import { EditorInput } from "./EditorInput";
import TreesTemp from "./FolderStructure";
import "./Page.css";
import { ModalComponent } from "./Modal";
import { LoadingModalComponent } from "./loadingModal";
import { RarityModalComponent } from "./RarityModal";

export const Page = (props) => {
  const { 
    disPatchObjects,
    selection,
    disPatchSelection,
    disPatchNumberOfCopies,
    disPatchLayerOrder
  } = useContext(ObjectContext);

  const [totalCopies, setTotalCopies] = useState(0);
  const [open, setOpen] = useState(false);
  const [rarityOpen, setRarityOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [coord, setCoor] = useState({ x: 0, y: 0 });
  const [canvasHeight, setCanvasHeight] = useState({
    value: 400,
  });
  const [canvasWidth, setCanvasWidth] = useState({
    value: 400,
  });

  const setCurrentElement = (val) => {
    disPatchSelection({
      type: "update",
      name: val,
    });
  };

  var parentRef = useRef(null);

  const handleMouseOver = (e) => {
    const parent = parentRef.current.getBoundingClientRect();
    const rect = e.target.getBoundingClientRect();
    const positionX = rect.left - parent.left;
    const positionY = rect.top - parent.top;
    const values = { x: positionX, y: positionY };

    return values;
  };

  const setCoord = (event, file) => {
    const curr_Coor = handleMouseOver(event);

    disPatchSelection({
      type: "update",
      name: `${file.name}`,
    });
    disPatchObjects({
      type: "update",
      nameToFind: selection.name,
      valueToChange: "x",
      currentSlide: curr_Coor.x,
    });
    disPatchObjects({
      type: "update",
      nameToFind: selection.name,
      valueToChange: "y",
      currentSlide: curr_Coor.y,
    });

    setCoor({ x: curr_Coor.x, y: curr_Coor.y });
  };

  const setValues = useCallback((input) => {
    console.log('input', input)
    const inputKeys = keys(input)
    forEach(inputKeys, (key) => {
      if(key === 'copyAmount') {
        setTotalCopies(input[key]);
        disPatchNumberOfCopies({
          type: "update",
          value: input[key]
        })
      } else if (key === 'layerOrder') {
        disPatchLayerOrder({
          type: "update",
          value: input[key]
        })
      } else {
        disPatchObjects({
          type: "update",
          nameToFind: selection.name,
          valueToChange: key,
          currentSlide: input[key],
        });
      }
    })
  }, [selection]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleRarityOpen = () => {
    setRarityOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRarityClose = () => {
    setRarityOpen(false);
  };

  const openLoadingModal = () => {
    setLoadingModal(true);
  };

  return (
    <div>
      <div
        style={{
          width: "15%",
          float: "left",
          backgroundColor: "rgb(23, 23, 44)",
          height: "100vh",
          padding: "5px",
          borderRadius: "10px",
          overflowX: "hidden",
          overflowY: "auto",
          zIndex: 20,
          transition: "width .35s",
        }}
      >
        <TreesTemp folderData={props.folderStructure} />
      </div>
      <div
        style={{
          width: "70%",
          float: "left",
          height: "100vh",
          padding: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "rgba(110, 110, 110, 0.658)",
            color: "#fff",
            fontFamily: "monospace",
            marginTop: "3vh",
            paddingRight: "5px",
          }}
        >
          <p>
            Canvas Height:{" "}
            <input
              style={{ width: 40 }}
              onChange={(event) => {
                setCanvasHeight({
                  value: JSON.parse(event.target.value),
                });
              }}
            />
            &nbsp; px &nbsp;Canvas Width:{" "}
            <input
              style={{ width: 40 }}
              onChange={(event) => {
                setCanvasWidth({
                  value: JSON.parse(event.target.value),
                });
              }}
            />
            &nbsp; px
          </p>
          <p>
            Selection: {selection.name} &nbsp; X: {coord.x} Y: {coord.y}
          </p>
        </div>

        <div className="items-container">
          <Items
            onClick={setCurrentElement}
            files={props.folderStructure}
            hashedFolder={props.hashedElements}
            imageHeight={canvasHeight.value}
            imageWidth={canvasWidth.value}
            setCoord={setCoord}
            parent={parentRef}
          />
        </div>
      </div>
      <div
        style={{
          width: "15%",
          float: "right",
          borderRadius: "10px",
          zIndex: 20,
          marginTop: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(23, 23, 44)",
            height: "100vh",
            margin: "5px 0px 5px 5px ",
            padding: "5px",
            boxShadow:
              "-5px 2px 4px -1px rgb(0 0 0 / 20%), -5px 4px 5px 0px rgb(0 0 0 / 14%), -5px 1px 10px 0px rgb(0 0 0 / 12%)",
          }}
        >
          <div>
            <EditorInput setValues={setValues} layers={map(props.hashedElements, 'name')}/>
          </div>
          <div
            style={{
              marginTop: "15px",
              padding: "5px",
            }}
          >
            <div style={{ justifyContent: "center", display: "flex" }}>
              <button
                className="transparent-button"
                onClick={handleRarityOpen}
              >
                Add Rarity
              </button>
            </div>
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                marginTop: "15px",
              }}
            >
              <button
                className="transparent-button"
                onClick={
                  totalCopies && totalCopies.value > 10000 ? null : handleOpen
                }
              >
                Generate
              </button>
            </div>
            <div>
              <RarityModalComponent
                isOpen={rarityOpen}
                handleClose={handleRarityClose}
                folderStructure={props.folderStructure}
              />
            </div>

            <div>
              <ModalComponent
                isOpen={open}
                handleClose={handleClose}
                canvasHeight={canvasHeight.value}
                canvasWidth={canvasWidth.value}
                openLoadingModal={openLoadingModal}
              />
            </div>
            <div>
              <LoadingModalComponent isOpen={loadingModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
