const LOAD = 'redux-example/file/LOAD';
const LOAD_SUCCESS = 'redux-example/file/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/file/LOAD_FAIL';
const UPLOAD = 'redux-example/file/UPLOAD';
const UPLOAD_SUCCESS = 'redux-example/file/UPLOAD_SUCCESS';
const UPLOAD_FAIL = 'redux-example/file/UPLOAD_FAIL';

const initialState = {
  loaded: false,
  files: [],
  dir: []
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
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.file && globalState.file.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('file/list')
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
