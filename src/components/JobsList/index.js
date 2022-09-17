import {Link} from 'react-router-dom'

import {BsFillStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobsList = props => {
  const {eachJob} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="link-items">
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
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobsList
