import {
  FETCH_REPOS,
  FETCH_PAGE,
  FETCH_ERROR,
  CLEAR_THINGS,
} from "../actions/types"

export default (state = [], action) => {
  switch (action.type) {
    case FETCH_REPOS:
      const repos = action.payload.map((i) => i)
      return [...state, ...repos]
    case CLEAR_THINGS:
      return action.payload
    case FETCH_ERROR:
      return action.payload
    default:
      return state
  }
}
