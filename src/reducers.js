import { combineReducers } from 'redux'

function userPool (state, action) {
  if (!state) {
    state = {
      selectedKey: null,
    }
  }

  const { type, payload } = action

  switch (type) {
    case 'userPool/save':
      return { ...state, ...payload }
    default:
      return state
  }
}

function orgManage (state, action) {
  if (!state) {
    state = {
      orgNodes: [],
      showEmpty: false,
      selectedKey: null,
      selectedType: null,
    }
  }

  const { type, payload } = action

  switch (type) {
    case 'orgManage/save':
      return { ...state, ...payload }
    default:
      return state
  }
}

export default combineReducers({ userPool, orgManage })