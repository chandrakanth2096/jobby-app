import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const FilterJobs = props => {
  const renderEmployList = () => {
    const {onChangeEmployType} = props

    return employmentTypesList.map(each => {
      const onChangeCheckbox = event => {
        onChangeEmployType(event.target.value)
      }

      return (
        <li className="list-item" key={each.employmentTypeId}>
          <input
            type="checkbox"
            className="checkbox"
            id={each.employmentTypeId}
            onChange={onChangeCheckbox}
            value={each.employmentTypeId}
          />
          <label className="label-text" htmlFor={each.employmentTypeId}>
            {each.label}
          </label>
        </li>
      )
    })
  }

  const renderEmploymentType = () => (
    <>
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="list-container">{renderEmployList()}</ul>
    </>
  )

  const renderSalaryList = () => {
    const {onChangeSalaryRange} = props

    return salaryRangesList.map(each => {
      const onChangeRadioInput = event => {
        console.log(event)
        console.log(event.target.value)
        onChangeSalaryRange(event.target.value)
      }
      return (
        <li className="list-item" key={each.salaryRangeId}>
          <input
            type="radio"
            className="radio"
            id={each.salaryRangeId}
            name="salary"
            onChange={onChangeRadioInput}
            value={each.salaryRangeId}
          />
          <label className="label-text" htmlFor={each.salaryRangeId}>
            {each.label}
          </label>
        </li>
      )
    })
  }

  const renderSalaryRange = () => (
    <>
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="list-container">{renderSalaryList()}</ul>
    </>
  )

  return (
    <div className="filters-section">
      <hr className="line" />
      {renderEmploymentType()}
      <hr className="line" />
      {renderSalaryRange()}
    </div>
  )
}

export default FilterJobs
