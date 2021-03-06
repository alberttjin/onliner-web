import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { MdClose } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { login } from "../utils/api";
import * as consts from "../utils/constants"
import swal from 'sweetalert';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
`

const ModalMain = styled.section`
  position:fixed;
  background: white;
  width: 20%;
  height: auto;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  border-radius: 15px;
  padding-bottom: 20px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border: 3px solid grey;
`

const InputStyled = styled.input`
  width: 80%;
  height: 35px;
  padding-left: 10px;
  font: 1em/1.25em Arial, Helvetica, sans-serif;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: none;
  outline: none;
  border: 1px solid lightgrey;
`

const SubmitStyled = styled.button`
  font: 1em/1.25em Arial, Helvetica, sans-serif;
  width: 85%;
  height: 35px;
  border: 2px solid lightgrey;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  &:hover {
    background: lightgrey;
  }
`

const CloseStyled = styled.button`
  background-color: white;
  border: none;
  cursor: pointer;
  &:hover {
    color: #828080;
  }
  outline: none;
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.p`
  font: 1em/1.25em Arial, Helvetica, sans-serif;
  font-size: 12;
  font-weight: 600;
  margin-top: 15px;
`

class Login extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    token: "",
  }

  componentWillMount = () => {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('keydown', this.handleEnter);
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('keydown', this.handleEnter);
  }

  handleClick = (e) => {
    if (!this.node.contains(e.target)) {
      this.props.handleClose();
    }
  }

  handleUsernameInput = (event) => {
    this.setState({username: event.target.value});
  }

  handlePasswordInput = (event) => {
    this.setState({password: event.target.value});
  }

  handleSubmit = async() => {
    const token = await login(this.state.username, this.state.password);
    if (token) {
      this.setState({token: token});
    } else {
      swal({
        title: "Oops!",
        text: "Invalid login credentials. Try again!",
        icon: "error",
      });
    }
  }

  handleEnter = (event) => {
    if (event.key === 'Enter' && this.props.show) {
      this.handleSubmit();
    }
  }

  render() {
    const { show, handleClose } = this.props;
    const show_hide = show ? {'display': 'block'} : {'display': 'none'}
    if (this.state.token) {
      // If token => store in cookie
      document.cookie = consts.ACCESS_TOKEN_KEY+ '=' + this.state.token;
      return <Redirect to={{pathname: '/home', state: {token: this.state.token}}}/>;
    } else {
      return (
        <Modal style={show_hide}>
          <ModalMain ref={node => this.node = node}>
            <RowWrapper>
              {/* <Title></Title> */}
              <Title>Login</Title>
              {/* <CloseStyled onClick={handleClose}>
                <IconContext.Provider value={{size: 20}}>
                  <MdClose />
                </IconContext.Provider>
              </CloseStyled> */}
            </RowWrapper>
            <ColumnWrapper>
              <InputStyled placeholder={"Username"} onChange={this.handleUsernameInput}/>
              <InputStyled type="password" placeholder={"Password"} onChange={this.handlePasswordInput}/>
              <SubmitStyled type="button" onClick={this.handleSubmit}>
                Log In
              </SubmitStyled>
            </ColumnWrapper>
          </ModalMain>
        </Modal>
      );
    }
  }
}

export default Login;