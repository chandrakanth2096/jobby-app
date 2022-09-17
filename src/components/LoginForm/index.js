import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isErrMsgShow: false,
    usernameErr: false,
    passwordErr: false,
    errorMsg: '',
  }

  validateUsername = () => {
    const {username} = this.state
    return username !== ''
  }

  validatePassword = () => {
    const {password} = this.state
    return password !== ''
  }

  onChangeUsernameBlur = () => {
    const isValidUsername = this.validateUsername()
    this.setState({usernameErr: !isValidUsername})
  }

  onChangePasswordBlur = () => {
    const isValidPassword = this.validatePassword()
    this.setState({passwordErr: !isValidPassword})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    this.setState({isErrMsgShow: false})
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({isErrMsgShow: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const errorMsg = data.error_msg

    const isValidUsername = this.validateUsername()
    const isValidPassword = this.validatePassword()

    if (isValidUsername && isValidPassword) {
      if (response.ok === true) {
        this.onSubmitSuccess(data.jwt_token)
      } else {
        this.onSubmitFailure(data.error_msg)
      }
    } else {
      this.setState({
        usernameErr: !isValidUsername,
        passwordErr: !isValidPassword,
        isErrMsgShow: true,
        errorMsg,
      })
    }
  }

  renderLoginForm = () => {
    const {
      username,
      password,
      isErrMsgShow,
      usernameErr,
      passwordErr,
      errorMsg,
    } = this.state

    return (
      <form className="login-form" onSubmit={this.onSubmitForm}>
        <label className="label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          className="input"
          id="username"
          value={username}
          placeholder="Username"
          onChange={this.onChangeUsername}
          onBlur={this.onChangeUsernameBlur}
        />
        {usernameErr && <p className="err-msg">*Please Enter Username</p>}

        <label className="label" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          className="input"
          id="password"
          value={password}
          placeholder="Password"
          onChange={this.onChangePassword}
          onBlur={this.onChangePasswordBlur}
        />
        {passwordErr && <p className="err-msg">*Please Enter Password</p>}

        <button type="submit" className="login-btn">
          Login
        </button>

        {isErrMsgShow && <p className="err-msg">{errorMsg}</p>}
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-section">
          <img
            className="login-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          {this.renderLoginForm()}
        </div>
      </div>
    )
  }
}

export default LoginForm
