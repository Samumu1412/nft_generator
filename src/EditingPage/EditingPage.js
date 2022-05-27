import React, {
  useState,
  createContext,
  useEffect,
  useReducer,
  useMemo,
} from 'react';
import {
  arrayReducer,
  objectReducer,
  selectionReducer,
  totalElementsReducer,
  TreeReducer,
} from './ObjectReducer';
import { Page } from './Page';
import CssBaseline from '@material-ui/core/CssBaseline';
import { NavComponent } from './Navbar';
import axios from 'axios';

export const ObjectContext = createContext();

export const EditingPage = () => {
  const baseURL = 'http://localhost:8443/getFolderTree';

  const [fileData, setFileData] = useState(null);

  const getTree = async () => {
    const data = await axios.get(baseURL, {
      params: { uuid: JSON.parse(sessionStorage.uuid) },
    });
    setFileData(data.data);
  };

  useEffect(() => {
    getTree();
  }, []);

  const subfoldersLength = useMemo(
    () => fileData && fileData.children && fileData.children.length,
    [fileData]
  );

  const [TreeState, disPatchTree] = useReducer(TreeReducer, fileData?.children);

  const hashCodeElement = useMemo(() => {
    const pathList = [];
    const ele = [];
    for (let i = 0; i < subfoldersLength; i++) {
      fileData &&
        fileData.children &&
        pathList.push(fileData.children[i].children[0].path.slice(3));
    }

    for (let i = 0; i < subfoldersLength; i++) {
      ele.push({
        name: fileData.children.length ? fileData.children[i].name : null,
        path: pathList[i],
      });
    }
    return ele;
  }, [fileData, subfoldersLength]);

  const selection = useMemo(
    () => ({ name: hashCodeElement[0] }),
    [hashCodeElement]
  );

  const [SelectionState, disPatchSelection] = useReducer(
    selectionReducer,
    selection
  );

  const total = { value: 100 };

  const [NumberOfCopiesState, disPatchNumberOfCopies] = useReducer(
    totalElementsReducer,
    total
  );

  const objects = useMemo(() => {
    const objects = [];
    subfoldersLength &&
      hashCodeElement &&
      hashCodeElement.map((obj) => {
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
  }, [hashCodeElement, subfoldersLength]);

  const [ObjectState, disPatchObjects] = useReducer(objectReducer, objects);

  const order = useMemo(() => {
    const order = [];

    subfoldersLength &&
      hashCodeElement &&
      hashCodeElement.map((_, index) => {
        order.push(JSON.stringify(index));
      });
    return order;
  }, [subfoldersLength, hashCodeElement]);

  const [layerOrder, disPatchLayerOrder] = useReducer(arrayReducer, order);

  useEffect(() => {
    disPatchTree({ type: 'add', payload: fileData });
    disPatchObjects({ type: 'add', payload: objects });
    disPatchSelection({
      type: 'update',
      name: hashCodeElement.length ? hashCodeElement[0].name : null,
    });
    disPatchLayerOrder({
      type: 'update',
      value: order,
    });
  }, [fileData, hashCodeElement, objects, order]);

  return (
    <ObjectContext.Provider
      value={{
        objects: ObjectState,
        disPatchObjects,
        tree: TreeState,
        disPatchTree,
        selection: SelectionState,
        disPatchSelection,
        numberOfCopies: NumberOfCopiesState,
        disPatchNumberOfCopies,
        layerOrder,
        disPatchLayerOrder,
      }}
    >
      <CssBaseline>
        <div style={{ maxHeight: '20px', zIndex: 21 }}>
          <NavComponent folderStructure={fileData} />
        </div>
        <div style={{ margin: '2px' }}>
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
