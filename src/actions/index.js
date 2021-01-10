import axios from "axios"
import { FETCH_REPOS, FETCH_ERROR, CLEAR_THINGS } from "../actions/types"
import React, { useEffect } from "react"

export const fetchRepos = (
  pageNum,
  setFetchingStatus,
  setPageNum,
  setStopFetching,
  query
) => async (dispatch) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${query}/repos?page=${pageNum}&per_page=10`
    )
    dispatch({
      type: FETCH_REPOS,
      payload: response.data,
    })
    if (response.data.length === 0) {
      setStopFetching(true)
      setFetchingStatus(false)
    } else {
      setPageNum((pageNum) => pageNum + 1)
    }
    setFetchingStatus(false)
  } catch (e) {
    dispatch({ type: FETCH_ERROR, payload: [] })
    setFetchingStatus(false)
    setStopFetching(true)
  } finally {
    setFetchingStatus(false)
  }
}

export const cleanupRepos = () => {
  return {
    type: CLEAR_THINGS,
    payload: [],
  }
}
