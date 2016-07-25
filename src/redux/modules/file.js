const LOAD = 'media-uploader-manager/file/LOAD';
const LOAD_SUCCESS = 'media-uploader-manager/file/LOAD_SUCCESS';
const LOAD_FAIL = 'media-uploader-manager/file/LOAD_FAIL';
const UPLOAD = 'media-uploader-manager/file/UPLOAD';
const UPLOAD_SUCCESS = 'media-uploader-manager/file/UPLOAD_SUCCESS';
const UPLOAD_FAIL = 'media-uploader-manager/file/UPLOAD_FAIL';
const NEW_FOLDER = 'media-uploader-manager/file/NEW_FOLDER';
const NEW_FOLDER_SUCCESS = 'media-uploader-manager/file/NEW_FOLDER_SUCCESS';
const NEW_FOLDER_FAIL = 'media-uploader-manager/file/NEW_FOLDER_FAIL';
const DELETE_FILE = 'media-uploader-manager/file/DELETE_FILE';
const DELETE_FILE_SUCCESS = 'media-uploader-manager/file/DELETE_FILE_SUCCESS';
const DELETE_FILE_FAIL = 'media-uploader-manager/file/DELETE_FILE_FAIL';
const RENAME_FILE = 'media-uploader-manager/file/RENAME_FILE';
const RENAME_FILE_SUCCESS = 'media-uploader-manager/file/RENAME_FILE_SUCCESS';
const RENAME_FILE_FAIL = 'media-uploader-manager/file/RENAME_FILE_FAIL';
const TOGGLE_VIEW = 'media-uploader-manager/file/TOGGLE_VIEW';
const ORDER_BY = 'media-uploader-manager/file/ORDER_BY';
const TOGGLE_SELECT = 'media-uploader-manager/file/TOGGLE_SELECT';

const initialState = {
  loaded: false,
  files: [],
  dir: [],
  pathString: '',
  view: 'list'
};

function existId( arr, id ) {
  for (const value of arr) {
    if (value.id === id) return true;
  }
  return false;
}

function sort(array, field) {
  return array.sort((elA, elB) => {
    const nameA = isNaN(elA[field]) ? elA[field].toUpperCase() : elA[field];
    const nameB = isNaN(elB[field]) ? elB[field].toUpperCase() : elB[field];
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        dir: action.result,
        pathString: action.path,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        dir: [],
        error: action.error
      };
    case UPLOAD:
      return {
        ...state,
        files: [
          ...state.files,
          ...action.files
        ],
      };
    case UPLOAD_SUCCESS:
      const filesPending = state.files.filter((file) => {
        return !existId(action.files, file.id);
      });
      return {
        ...state,
        files: filesPending,
        dir: [
          ...state.dir,
          ...action.result.files
        ]
      };
    case UPLOAD_FAIL:
      const filesPendingAfterUploadFail = state.files.filter((file) => {
        return !existId(action.files, file.id);
      });
      return {
        ...state,
        error: action.error,
        files: filesPendingAfterUploadFail,
      };
    case NEW_FOLDER:
      return state;
    case NEW_FOLDER_SUCCESS:
      return {
        ...state,
        dir: [
          ...state.dir,
          ...action.folder
        ]
      };
    case NEW_FOLDER_FAIL:
      return {
        ...state,
        error: action.error
      };
    case DELETE_FILE:
      return state;
    case DELETE_FILE_SUCCESS:
      return {
        ...state,
        dir: state.dir.filter((file) => {
          return file.id !== action.id;
        })
      };
    case DELETE_FILE_FAIL:
      return {
        ...state,
        error: action.error
      };
    case RENAME_FILE:
      return state;
    case RENAME_FILE_SUCCESS:
      return {
        ...state,
        dir: state.dir.map((file) => {
          return file.id === action.id ? Object.assign({}, file, {id: new Date().getTime() + '_' + action.newName, name: action.newName}) : file;
        })
      };
    case RENAME_FILE_FAIL:
      return {
        ...state,
        error: action.error
      };
    case TOGGLE_VIEW:
      return {
        ...state,
        view: state.view === 'module' ? 'list' : 'module'
      };
    case ORDER_BY:
      const mapped = state.dir.map((el) => {
        return el;
      });
      return {
        ...state,
        dir: sort(mapped, action.field)
      };
    case TOGGLE_SELECT:
      return {
        ...state,
        dir: state.dir.map((file) => {
          return file.id === action.id ? Object.assign({}, file, {selected: !file.selected}) : file;
        })
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.file && globalState.file.loaded;
}

export function load(path) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    path: path,
    promise: (client) => client.get('file/list', {
      params: {path: path}
    })
  };
}

export function upload(pathString, files) {
  const formData = new FormData();
  formData.append('path', pathString);
  const arrayFiles = [];

  for (const key in files) {
    if (files.hasOwnProperty(key) && files[key] instanceof File) { // is the item a File?
      formData.append('files', files[key]);
      arrayFiles.push({id: new Date().getTime() + '_' + files[key].name, name: files[key].name});
    }
  }

  return {
    types: [UPLOAD, UPLOAD_SUCCESS, UPLOAD_FAIL],
    files: arrayFiles,
    promise: (client) => client.post('file/upload', {
      data: formData
    })
  };
}

export function newFolder(pathString, folder) {
  return {
    types: [NEW_FOLDER, NEW_FOLDER_SUCCESS, NEW_FOLDER_FAIL],
    folder: [{id: new Date().getTime() + '_' + folder, type: 'folder', name: folder, mtime: new Date()}],
    promise: (client) => client.post('file/newFolder', {
      data: {folder: pathString + '/' + folder}
    })
  };
}

export function deleteFile(pathString, file) {
  return {
    types: [DELETE_FILE, DELETE_FILE_SUCCESS, DELETE_FILE_FAIL],
    id: file.id,
    promise: (client) => client.del('file/deleteFile', {
      data: {file: pathString + '/' + file.name}
    })
  };
}

export function renameFile(pathString, file, newName) {
  return {
    types: [RENAME_FILE, RENAME_FILE_SUCCESS, RENAME_FILE_FAIL],
    id: file.id,
    newName: newName,
    promise: (client) => client.post('file/renameFile', {
      data: {file: pathString + '/' + file.name, newName: pathString + '/' + newName}
    })
  };
}

export function toggleView() {
  return {
    type: TOGGLE_VIEW
  };
}

export function orderBy(field) {
  return {
    type: ORDER_BY,
    field: field
  };
}

export function toggleSelect(id) {
  return {
    type: TOGGLE_SELECT,
    id: id
  };
}
