import React, { useState, createContext, useEffect, useReducer } from "react";
import {
  objectReducer,
  selectionReducer,
  totalElementsReducer,
  TreeReducer,
} from "./ObjectReducer";
import { Page } from "./Page";
import CssBaseline from "@material-ui/core/CssBaseline";
import { NavComponent } from "./Navbar";
import axios from "axios";

export const ObjectContext = createContext();

export const ObjectSelection = createContext();
export const NumberOfCopies = createContext();
export const TreeContext = createContext();

export const EditingPage = () => {
  const baseURL = "http://localhost:8443/getFolderTree";

  const [fileData, setFileData] = useState(null);

  let selection = null;
  let objects = [];
  let total = { value: 100 };

  const getTree = async () => {
    const data = await axios.get(baseURL, {
      params: { uuid: JSON.parse(sessionStorage.uuid) },
    });
    //const data = await response.json();
    setFileData(data.data);
  };

  useEffect(() => {
    getTree();
  }, []);

  const subfoldersLength =
    fileData && fileData.children && fileData.children.length;

  const hashCodeElement = [];
  const pathList = [];

  for (let i = 0; i < subfoldersLength; i++) {
    fileData &&
      fileData.children &&
      pathList.push(fileData.children[i].children[0].path.slice(3));
  }

  for (let i = 0; i < subfoldersLength; i++) {
    hashCodeElement.push({
      name: fileData.children.length ? fileData.children[i].name : null,
      path: pathList[i],
    });
  }

  const getObjects = (files) => {
    const objects = [];

    subfoldersLength &&
      files &&
      files.map((obj) => {
        objects.push({
          name: obj.name,
          path: obj.path,
          height: 500,
          width: 500,
          depth: 0,
          x: 0,
          y: 0,
        });
      });
    return objects;
  };

  objects = getObjects(hashCodeElement);

  useEffect(() => {
    disPatchTree({ type: "add", payload: fileData });
    disPatchObjects({ type: "add", payload: objects });
    disPatchSelection({
      type: "update",
      name: hashCodeElement.length ? hashCodeElement[0].name : null,
    });
  }, [fileData]);

  selection = { name: hashCodeElement[0] };
  total = { value: 100 };

  const [TreeState, disPatchTree] = useReducer(
    TreeReducer,
    fileData?.children
  );
  const [ObjectState, disPatchObjects] = useReducer(objectReducer, objects);
  const [SelectionState, disPatchSelection] = useReducer(
    selectionReducer,
    selection
  );
  const [NumberOfCopiesState, disPatchNumberOfCopies] = useReducer(
    totalElementsReducer,
    total
  );

  return (
      <ObjectContext.Provider value={{
          objects: ObjectState,
          disPatchObjects,
          tree: TreeState,
          disPatchTree,
          selection: SelectionState,
          disPatchSelection,
          numberOfCopies: NumberOfCopiesState,
          disPatchNumberOfCopies,

        }}>
          <CssBaseline>
            <div style={{ maxHeight: "20px", zIndex: 21 }}>
              <NavComponent folderStructure={fileData} />
            </div>
            <div style={{ margin: "2px" }}>
              <Page
                folderStructure={fileData}
                selection={selection}
                hashedElements={objects}
              />
            </div>
          </CssBaseline>
      </ObjectContext.Provider>
  );
};
