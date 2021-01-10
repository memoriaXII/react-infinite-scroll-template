import React, { useEffect, useRef, useState } from "react"
import "./App.scss"
import { useInfiniteScroll, usePrevious } from "./utils/customHook"
import { connect } from "react-redux"
import * as actions from "./actions"
import downloadSvg from "./images/loading.svg"
import debounce from "lodash.debounce"

function App(props) {
  const { fetchRepos } = props
  const containerRef = useRef(null)
  const [searchState, setSearchState] = useState({
    query: "rex-taiwan",
  })
  const [switchMode, setSwitchMode] = useState(false)
  const [currentState, relatedSetupFunctions] = useInfiniteScroll(
    fetchRepos,
    searchState.query
  )
  const prevQuery = usePrevious(searchState.query)
  const { pageNum, isFetching } = currentState
  const {
    setPageNum,
    setFetchingStatus,
    setStopFetching,
  } = relatedSetupFunctions
  const onSearchItemWithDebounce = debounce((query) => {
    if (prevQuery == query) {
      setPageNum((pageNum) => pageNum + 1)
      setStopFetching(false)
      setFetchingStatus(false)
      setSearchState({
        query: prevQuery,
      })
    } else {
      props.cleanupRepos()
      setPageNum(1)
      setStopFetching(false)
      setFetchingStatus(true)
      setSearchState({
        query: query,
      })
    }
  }, 800)

  useEffect(() => {
    if (searchState.query && prevQuery !== searchState.query) {
      setFetchingStatus(true)
      fetchRepos(
        pageNum,
        setFetchingStatus,
        setPageNum,
        setStopFetching,
        searchState.query
      )
    }
  }, [searchState.query])

  useEffect(() => {
    const toggleButton = document.querySelector(".dark-light")
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode")
      })
    }
    return () =>
      toggleButton.removeEventListener("click", () => {
        document.body.classList.toggle("dark-mode")
      })
  }, [])

  return (
    <div>
      <div class="main-wrapper" ref={containerRef}>
        <div class="header">
          <div class="logo">REPOPEEK ®</div>

          <div
            class="dark-light"
            onClick={() => {
              setSwitchMode(!switchMode)
            }}
          >
            {switchMode ? (
              <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-sun"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </div>
        </div>
        <div class="wrapper">
          <div class="search-wrapper">
            <div class="search-bar">
              <input
                type="text"
                placeholder="Search"
                class="search-box"
                autofocus
                onChange={(e) => {
                  onSearchItemWithDebounce(e.target.value)
                }}
              />
            </div>
          </div>
          <div class="main-container">
            <div>
              <div>
                {props.reposArray.length ? (
                  <>
                    Showing{" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    >
                      {props.reposArray.length}
                    </span>{" "}
                    Repos from
                    <span
                      style={{
                        fontWeight: "bold",
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    >
                      {searchState.query}
                    </span>
                  </>
                ) : null}
              </div>

              <div class="cards-container" style={{ overflow: "hidden" }}>
                <div class="not-found-section">
                  {props.reposArray.length == 0 ? (
                    <>
                      <div class="svg-block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-alert-circle"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>

                      <h1 class="title">Can't found current user profile</h1>
                    </>
                  ) : null}
                </div>

                {props.reposArray.map((repo, index) => (
                  <>
                    <div
                      class="info-card"
                      key={repo.id}
                      onClick={() => {
                        window.open(repo.svn_url)
                      }}
                    >
                      <div class="info-card-header">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="124"
                          height="124"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0162ff"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="feather feather-github"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <div class="dots"></div>
                      </div>
                      <div class="info-card-title">{repo.name}</div>
                      <div class="info-card-subtitle line-clamp-text">
                        {repo.description}
                      </div>

                      <button class="buttons detail-button">
                        {repo.language || "Others"}
                      </button>

                      <div class="info-card-buttons">
                        <button
                          class="buttons card-buttons"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(repo.svn_url)
                          }}
                        >
                          Check Info
                        </button>
                        <button
                          class="buttons card-buttons-msg"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(repo.svn_url + `/archive/master.zip`)
                          }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFetching && props.reposArray.length !== 0 && (
        <div className="spinner">
          <span style={{ opacity: 0 }}>Loading</span>
          <img src={downloadSvg} alt="" />
        </div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    reposArray: state.repos,
  }
}

export default connect(mapStateToProps, actions)(App)
