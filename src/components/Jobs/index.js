import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import FilterJobs from '../FilterJobs'
import JobsList from '../JobsList'

import './index.css'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

const profileStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
  profileDetails: [],
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusList.initial,
    profileStatus: profileStatusList.initial,
    jobsList: [],
    searchInput: '',
    activeEmployTypeList: [],
    activeSalaryRangeId: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusList.in_progress})
    const {activeEmployTypeList, activeSalaryRangeId, searchInput} = this.state
    const activeEmployId = activeEmployTypeList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmployId}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      this.setState({apiStatus: apiStatusList.success})
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  getProfile = async () => {
    this.setState({profileStatus: profileStatusList.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const responses = await fetch(profileApiUrl, options)
    if (responses.ok === true) {
      const data = await responses.json()
      const profileData = data.profile_details
      const updatedProfileData = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }
      profileStatusList.profileDetails = updatedProfileData
      this.setState({profileStatus: profileStatusList.success})
    } else {
      this.setState({profileStatus: profileStatusList.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onKeySearchResults = event => {
    if (event.key === 'Enter' || event.type === 'click') {
      this.getJobs()
    }
  }

  renderJobsView = () => {
    const {jobsList, searchInput} = this.state
    const showJobsList = jobsList.length > 0

    return showJobsList ? (
      <>
        <div className="input-lg-container">
          <input
            type="search"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            onKeyDown={this.onKeySearchResults}
            placeholder="Search"
          />
          <button
            className="search-btn"
            type="button"
            onClick={this.onKeySearchResults}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <ul className="jobs-list">
          {jobsList.map(each => (
            <JobsList key={each.id} eachJob={each} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-jobs">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    )
  }

  onClickJobsRetry = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="jobs-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-msg">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickJobsRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderJobsView()
      case apiStatusList.failure:
        return this.renderFailureView()
      case apiStatusList.in_progress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileSuccess = () => {
    const {name, profileImageUrl, shortBio} = profileStatusList.profileDetails

    return (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  onClickProfileRetry = () => {
    this.getProfile()
  }

  renderProfileFailure = () => (
    <div className="profile-failure">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickProfileRetry}
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoadingView = () => (
    <div className="profile-loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderProfileSection = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileStatusList.success:
        return this.renderProfileSuccess()
      case profileStatusList.failure:
        return this.renderProfileFailure()
      case profileStatusList.in_progress:
        return this.renderProfileLoadingView()
      default:
        return null
    }
  }

  onChangeSalaryRange = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobs)
  }

  onChangeEmployType = activeEmployTypeId => {
    const {activeEmployTypeList} = this.state
    if (activeEmployTypeList.includes(activeEmployTypeId)) {
      const index = activeEmployTypeList.indexOf(activeEmployTypeId)
      activeEmployTypeList.splice(index, 1)
      this.setState({activeEmployTypeList}, this.getJobs)
    } else {
      this.setState(
        prevState => ({
          activeEmployTypeList: [
            ...prevState.activeEmployTypeList,
            activeEmployTypeId,
          ],
        }),
        this.getJobs,
      )
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="input-sm-container">
            <input
              type="search"
              className="search-input"
              value={searchInput}
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onKeySearchResults}
              placeholder="Search"
            />
            <button
              type="button"
              className="search-btn"
              onClick={this.onKeySearchResults}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="filters-sidebar">
            <div className="profile-section">{this.renderProfileSection()}</div>
            <div className="filters-section">
              <FilterJobs
                onChangeEmployType={this.onChangeEmployType}
                onChangeSalaryRange={this.onChangeSalaryRange}
              />
            </div>
          </div>
          <div className="jobs-section">{this.renderJobs()}</div>
        </div>
      </>
    )
  }
}

export default Jobs
