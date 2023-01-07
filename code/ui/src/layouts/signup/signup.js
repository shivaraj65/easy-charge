import React,{useState} from 'react'
import './signup.css'
import { useNavigate } from "react-router-dom";
import {SECRET,CLIENT_ID,REDIRECT_URI,SCOPE} from '../../assets/keys/coinbase';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Signup=()=>{
    let navigate = useNavigate();
    
    // states and function for the modal
    const [popupContent,setPopupContent]=useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordTest, setpasswordTest] = useState(null)

    const submitHandlerPage1=(event)=>{
        event.preventDefault();
        if(passwordTest===true){
            const json ={Email: email,Name:name,Password: password};                            
            const config  = { headers: { 
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            } } 
            axios.post('http://localhost:3001/signupW', JSON.stringify(json),config)
                .then(function (response) {
                    if(response.data.ststus==="success"){
                        setPopupContent(response.data.message);
                        handleShow();
                        navigate("/");
                    }   else{
                        setPopupContent(response.data.message);
                        handleShow();
                    }                  
                                            
                })
                .catch(function (error) {                    
                    setPopupContent("server error! try again later.");
                    handleShow();                     
                });
            setName("");
            setEmail("");
            setPassword("");
        }else{
            setPopupContent("Enter a valid Password to proceed.");
            handleShow();
            setPassword("");
        }
    }

    const handleSignupCoinbase=()=>{
        window.location.replace("http://www.coinbase.com/oauth/authorize?response_type=code&client_id="+CLIENT_ID+"&redirect_uri="+REDIRECT_URI+"&state="+SECRET+"&scope="+SCOPE+"&account=all")        
    }

    //password test function
    const passwordTestfunc=(data)=>{
        if(!data.match(/[a-z]/g)){
            setpasswordTest(false)
          document.getElementById("password-validation-text").innerHTML = "you must use a small letter";         
        }else if(!data.match(/[A-Z]/g)){
            setpasswordTest(false)
          document.getElementById("password-validation-text").innerHTML = "you must use a capital letter";         
        } else if(!data.match(/[0-9]/g)){
            setpasswordTest(false)
          document.getElementById("password-validation-text").innerHTML = "you must use a number";         
        }else if(!(data.length >= 8)){
            setpasswordTest(false)
          document.getElementById("password-validation-text").innerHTML = "minimum password lenght must be 8";         
        }else{
            setpasswordTest(true)        
          document.getElementById("password-validation-text").innerHTML = ""; 
        }
      }

    return(
        <div className='fullscreen-signup'>
            <div className='closeButton'>
                <button 
                    className='btn p-0 '
                    onClick={()=>{
                    navigate("/");
                }}><img src="https://img.icons8.com/fluency/48/000000/delete-sign.png"/></button>                    
            </div>
            <div className='card shadow form-signin-1'>    
                    <form onSubmit={submitHandlerPage1}>
                        <h1 className='font-2 text-light text-center'>SIGNUP</h1>
                        
                        <button 
                            type="button"
                            className='coinbase-button btn btn-primary btn-lg font-4'
                            onClick={()=>{
                                handleSignupCoinbase();
                            }}
                            >Signup with <span className='fw-bold font-3'>coinbase</span></button>
                        {/* <h6 className="text-center text-light font-4 mt-3">or</h6> */}
                        <hr/>
                        <div className="form-group">                                        
                            <label htmlFor="name" className='text-light font-4 fw-normal'>Name :</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name"
                                required 
                                autoFocus
                                className="form-control text-dark fw-bold" 
                                placeholder="enter your name"
                                value={name}
                                onChange={(e)=>{setName(e.target.value)}}
                                />
                        </div>

                        <div className="form-group my-2">                                        
                            <label htmlFor="email" className='text-light font-4 fw-normal'>Email :</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="name"
                                required 
                                className="form-control text-dark fw-bold" 
                                placeholder="Email ID"
                                value={email}
                                onChange={(e)=>{setEmail(e.target.value)}}
                                />
                        </div>

                        <div className="form-group">                                        
                            <label htmlFor="password" className='text-light font-4 fw-normal'>Password :</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="name"
                                required 
                                className="form-control text-dark fw-bold" 
                                placeholder="password"
                                value={password}
                                onChange={(e)=>{
                                    setPassword(e.target.value)
                                    passwordTestfunc(e.target.value)
                                }}
                                />
                            <p id="password-validation-text" className="text-danger text-center pt-1 m-0"></p>
                        </div>
                        <button 
                            className="btn btn-light font-3 fw-bold my-3 signup-button" 
                            type="submit"
                            style={{letterSpacing: "4px"}}
                            >Signup &gt;</button>
                        <p className='font-3 text-info'>Already have an account. <a className='text-light fw-bold me-2 font-3' onClick={()=>{navigate("/login")}}>Login here!</a></p>
                    </form>                                               
            </div>
             {/* popup */}
             <Modal
                show={show}
                onHide={handleClose}
                // backdrop="static"
                keyboard={false}
                centered                
                >
                <Modal.Header>
                <Modal.Title><span className='font-1 display-4 text-primary'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-center font-4 fw-bold'>{popupContent}</p>
                </Modal.Body>
                <Modal.Footer>
                <Button className="px-4 font-3" variant="danger" onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default React.memo(Signup);