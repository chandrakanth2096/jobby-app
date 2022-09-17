import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {RiShareBoxLine} from 'react-icons/ri'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {jobItemDetailsList: {}, apiStatus: apiStatusList.initial}

  componentDidMount() {
    this.getJobItemDetails()
  }

  camelCaseJobDetails = data => ({
    id: data.id,
    title: data.title,
    rating: data.rating,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    jobDescription: data.job_description,
  })

  camelCaseLifeCompany = data => ({
    imageUrl: data.image_url,
    description: data.description,
  })

  camelCaseSkills = data =>
    data.map(each => ({
      imageUrl: each.image_url,
      name: each.name,
    }))

  camelCaseSimilar = data =>
    data.map(each => ({
      id: each.id,
      title: each.title,
      rating: each.rating,
      location: each.location,
      companyLogoUrl: each.company_logo_url,
      employmentType: each.employment_type,
      jobDescription: each.job_description,
    }))

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusList.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {id} = match.params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const jobDetailsList = this.camelCaseJobDetails(fetchedData.job_details)
      const lifeAtCompany = this.camelCaseLifeCompany(
        fetchedData.job_details.life_at_company,
      )
      const skillsList = this.camelCaseSkills(fetchedData.job_details.skills)
      const similarJobsList = this.camelCaseSimilar(fetchedData.similar_jobs)

      this.setState({
        jobItemDetailsList: {
          jobDetailsList,
          lifeAtCompany,
          skillsList,
          similarJobsList,
        },
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  renderSkillsSection = () => {
    const {jobItemDetailsList} = this.state
    return (
      <div className="skills-container">
        <h1 className="skills">Skills</h1>
        <ul className="skills-list">
          {jobItemDetailsList.skillsList.map(each => (
            <li className="skills-item" key={each.name}>
              <div className="image-name">
                <img
                  className="skill-img"
                  src={each.imageUrl}
                  alt={each.name}
                />
                <p className="skill-name">{each.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLifeAtCompany = () => {
    const {jobItemDetailsList} = this.state
    const {description, imageUrl} = jobItemDetailsList.lifeAtCompany

    return (
      <div className="life-at-company-container">
        <h1 className="skills">Life At Company</h1>
        <div className="life-at-section">
          <p className="life-at-content">{description}</p>
          <img className="life-at-img" alt="life at company" src={imageUrl} />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {jobItemDetailsList} = this.state

    return (
      <div className="similar-jobs-container">
        <h1 className="similar-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {jobItemDetailsList.similarJobsList.map(each => (
            <li className="similar-jobs-item" key={each.id}>
              <div className="info-section">
                <img
                  className="company-logo"
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
                />
                <div className="info">
                  <h1 className="job-title">{each.title}</h1>
                  <div className="rating-section">
                    <BsFillStarFill className="star" fill="#fbbf24" />
                    <p className="job-rating">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="description">
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
              </div>
              <div className="info-2">
                <div className="location-section">
                  <MdLocationOn className="place-icon" />
                  <p className="place">{each.location}</p>
                  <BsBriefcaseFill className="place-icon" />
                  <p className="place">{each.employmentType}</p>
                </div>
                <p className="lpa">{each.packagePerAnnum}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetailsView = () => {
    const {jobItemDetailsList} = this.state
    const {
      title,
      rating,
      location,
      packagePerAnnum,
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
    } = jobItemDetailsList.jobDetailsList

    return (
      <>
        <div className="job-item-details">
          <div className="info-section">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="info">
              <h1 className="job-title">{title}</h1>
              <div className="rating-section">
                <BsFillStarFill className="star" fill="#fbbf24" />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="info-2">
            <div className="location-section">
              <MdLocationOn className="place-icon" />
              <p className="place">{location}</p>
              <BsBriefcaseFill className="place-icon" />
              <p className="place">{employmentType}</p>
            </div>
            <p className="lpa">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description">
            <div className="visit-section">
              <h1>Description</h1>
              <div className="visit-buttons">
                <a href={companyWebsiteUrl} className="visit">
                  Visit
                </a>
                <RiShareBoxLine
                  href={companyWebsiteUrl}
                  className="share-icon"
                />
              </div>
            </div>
            <p>{jobDescription}</p>
          </div>
          {this.renderSkillsSection()}
          {this.renderLifeAtCompany()}
        </div>
        {this.renderSimilarJobs()}
      </>
    )
  }

  onClickJobDetailsRetry = () => {
    this.getJobItemDetails()
  }

  renderJobDetailFailureView = () => (
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
        onClick={this.onClickJobDetailsRetry}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderJobDetailsView()
      case apiStatusList.failure:
        return this.renderJobDetailFailureView()
      case apiStatusList.in_progress:
        return this.renderJobDetailLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobItemDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
