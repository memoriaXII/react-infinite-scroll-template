import { useState, useEffect, useLayoutEffect, useRef } from "react"

export const useInfiniteScroll = (fetchReposCallback, query) => {
  const initialState = {
    repos: [],
    page: 1,
    isFetching: false,
  }
  const [pageNum, setPageNum] = useState(initialState.page)
  const [isFetching, setFetchingStatus] = useState(initialState.isFetching)
  const [stopFetching, setStopFetching] = useState(false)

  const handleOnScroll = () => {
    const scrollHeight = window.scrollY
    const triggerEndStatus =
      scrollHeight + document.body.clientHeight >= document.body.scrollHeight

    if (triggerEndStatus && !isFetching) {
      setFetchingStatus(true)
      fetchReposCallback(
        pageNum,
        setFetchingStatus,
        setPageNum,
        setStopFetching,
        query
      )
    }
  }

  useLayoutEffect(() => {
    if (!stopFetching) window.addEventListener("scroll", handleOnScroll)
    return () => window.removeEventListener("scroll", handleOnScroll)
  }, [pageNum, isFetching, stopFetching])

  const currentState = { pageNum, isFetching }
  const relatedSetupFunctions = {
    setPageNum,
    setFetchingStatus,
    setStopFetching,
  }

  return [currentState, relatedSetupFunctions]
}

export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
