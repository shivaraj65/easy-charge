import React,{useState,useEffect} from 'react'
import { useSearchParams } from 'react-router-dom';
import {SECRET,CLIENT_ID,REDIRECT_URI,SCOPE} from '../../assets/keys/coinbase';
import axios from 'axios'
import './auth.css';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Auth=()=>{
    let navigate = useNavigate();

    // states and function for the modal
    const [popupContent,setPopupContent]=useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [searchParams, setSearchParams] = useSearchParams();    
    
    const [test, setTest] = useState(null)

    useEffect(() => {
        // console.log(searchParams.get('code'));
        const data = {
            'grant_type': 'authorization_code',
            'code': searchParams.get('code'),
            'client_id': CLIENT_ID,
            'client_secret': searchParams.get('state'),
            'redirect_uri': REDIRECT_URI
          };          
          
        const config  = {headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }}

        axios.post('https://api.coinbase.com/oauth/token', JSON.stringify(data),config)
            .then(function (response) {                             
               console.log(response.data);               
               getData(response.data);
            })
            .catch(function (error) {
                alert("error 1!");
                navigate("/");
            });             
    }, [])

    const getData=(data)=>{       
        const config  = {headers: {
            'Authorization': 'Bearer '+data.access_token,
            'CB-VERSION': '2021-06-23',            
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }}
        axios.get('https://api.coinbase.com/v2/user', config)
            .then(function (response) { 
                coinbaseauth(response.data.data.name,response.data.data.email,response.data.data.id);                                               
            })
            .catch(function (error) {
                alert("unable to contact coinbase servers or token expired!");
                navigate("/");
            }); 
    }

    const coinbaseauth=(name,email,id)=>{
        const json ={Email: email,Name:name};                            
        const config  = { headers: { 
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        } } 
        axios.post('http://localhost:3001/coinbaseauth', JSON.stringify(json),config)
            .then(function (response) {                  
                if(response.data.status==="error"){                   
                    setPopupContent(response.data.message);
                    handleShow();
                }else{
                    // window.sessionStorage.setItem('userID',id);
                    // window.sessionStorage.setItem('userName', name);
                    // window.sessionStorage.setItem('userEmail',email);
                    // navigate("/dashboard/"+email);
                    getUserDetails2(email);
                }
            })
            .catch(function (error) {     
                console.log(error);
                alert("unable to contact the server");
                navigate("/");
            });
    }

    const getUserDetails2=(email)=>{
        const json ={Email: email};                            
        const config  = { headers: { 
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        } } 
        axios.post('http://localhost:3001/getuser', JSON.stringify(json),config)
            .then(function (response) {                  
                if(response.data.status==="error"){                   
                    // setPopupContent(response.data.message);
                    // handleShow();
                    navigate("/");
                }else{
                    
                    window.sessionStorage.setItem('userID',response.data.message.userID);
                    window.sessionStorage.setItem('userName', response.data.message.name);
                    window.sessionStorage.setItem('userEmail',response.data.message._id);
                    navigate("/dashboard/"+response.data.message._id);
                }
            })
            .catch(function (error) {     
                console.log(error);
                alert("unable to contact the server 222");
                navigate("/");
            });

    }

    return(
        <div className='bg-auth'>
            <div className='card shadow form-auth-1 text-center'>
                <div>
                    <h1><span className='badge rounded-pill bg-primary'>Coinbase</span></h1>
                    <h1 className='text-light font-3'> Authenticating &nbsp;
                        <div className="spinner-grow text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </h1>                   
                </div>                
            </div>   

            {/* popup */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered                
                >
                <Modal.Header>
                <Modal.Title><span className='font-1 display-4 text-primary'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-center font-4 fw-bold'>{popupContent}</p>
                    <button 
                        className='btn btn-dark fw-bold font-3 px-3'
                        onClick={()=>{
                            handleClose();
                            navigate("/");
                        }}
                        >Close</button>
                </Modal.Body>               
            </Modal>                     
        </div>
    )
}
export default React.memo(Auth);