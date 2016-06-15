const LOAD = 'redux-example/file/LOAD';
const LOAD_SUCCESS = 'redux-example/file/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/file/LOAD_FAIL';
const UPLOAD = 'redux-example/file/UPLOAD';
const UPLOAD_SUCCESS = 'redux-example/file/UPLOAD_SUCCESS';
const UPLOAD_FAIL = 'redux-example/file/UPLOAD_FAIL';
const NEW_FOLDER = 'redux-example/file/NEW_FOLDER';
const NEW_FOLDER_SUCCESS = 'redux-example/file/NEW_FOLDER_SUCCESS';
const NEW_FOLDER_FAIL = 'redux-example/file/NEW_FOLDER_FAIL';

const initialState = {
  loaded: false,
  files: [],
  dir: [],
  pathArray: [],
  pathString: ''
};

function existId( arr, id ) {
  for (const value of arr) {
    if (value.id === id) return true;
  }
  return false;
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
        pathArray: [
          ...state.pathArray,
          action.path
        ],
        pathString: action.path !== '' ? state.pathString + '/' + action.path : state.pathString,
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

export function upload(files) {
  const formData = new FormData();
  const arrayFiles = [];

  for (const key in files) {
    if (files.hasOwnProperty(key) && files[key] instanceof File) { // is the item a File?
      formData.append('files', files[key]);
      arrayFiles.push( { id: new Date().getTime() + '_' + files[key].name, name: files[key].name } );
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

export function newFolder(folder) {
  return {
    types: [NEW_FOLDER, NEW_FOLDER_SUCCESS, NEW_FOLDER_FAIL],
    folder: [{type: 'folder', name: folder }],
    promise: (client) => client.post('file/newFolder', {
      data: {folder: folder}
    })
  };
}
