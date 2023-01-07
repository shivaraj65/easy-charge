import React,{useState,useEffect} from 'react';
import '../profile.css';
import axios from 'axios'
import {useParams} from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const Security =()=>{
    let {email}=useParams();

    const [data, setData] = useState(null);
    const [effectTrigger, setEffectTrigger] = useState(false)

    const [page, setPage] = useState(1)

    const [otp, setOTP] = useState("")

    const [qr,setQR] = useState(null)

    
    // states and function for the modal
    const [popupContent,setPopupContent]=useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    useEffect(() => {
        const json ={Email: email};                            
        const config  = { headers: { 
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        } }
        axios.post('http://localhost:3001/getuser', JSON.stringify(json),config)
        .then(function (response) {                  
            if(response.data.status==="success"){                   
               setData(response.data.message);
            }
        })
        .catch(function (error) {
            alert("Lost connection with the server.");
        });
      
    }, [effectTrigger])

    const toggle=(state)=>{
        const json={Email: data._id,toggle:!state};        
        const config  = { headers: { 
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        } }
        axios.post('http://localhost:3001/totpSet', JSON.stringify(json),config)
            .then(function (response) {                  
                if(response.data.status==="error"){                   
                    setPage(3);
                    setPopupContent(response.data.message);
                }else{
                    if(state){
                        setPage(3);
                        setPopupContent(response.data.message);
                        setEffectTrigger(!effectTrigger);
                    }else{
                        setQR(response.data.message);
                        setPage(2);
                    }                    
                }
            })
            .catch(function (error) {     
                alert("Something went wrong Try Again!");
            });
    }

    const submitHandlerOTP=(event)=>{
        event.preventDefault();
        const json ={Token:otp,Email:data._id};                            
        const config  = { headers: { 
            'Content-Type' : 'application/json' ,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        } }
        axios.post('http://localhost:3001/tokenVerify  ', JSON.stringify(json),config)
                .then(function (response) { 
                    if(response.data.status==="error"){
                        setPopupContent(response.data.message);
                        setPage(3);
                    } else {
                        setPopupContent(response.data.message);
                        setPage(3);        
                        setEffectTrigger(!effectTrigger);                                                                        
                    }                             
                })
                .catch(function (error) {                    
                    alert("Something went wrong Try Again!");
                });
    }

    return(
        <div className='p-4 mb-5'>
            {data?
                <div>
                    <h4 className='text-secondary pb-2'>Security</h4>
                    <hr/>            
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <h5 className='font-3 mx-0'>Two Factor Authentication : </h5>
                            </td>
                            <td>
                                <h5 className='ms-5'>
                                    { data.totpStatus===false?
                                            <span 
                                                className='font-3 fw-bold badge rounded-pill bg-danger hover-btn shadow'
                                                onClick={()=>{
                                                    setPage(1)
                                                    handleShow()
                                                }}
                                                >Disabled</span>
                                        :
                                            <span 
                                                className='font-3 fw-bold badge rounded-pill bg-success hover-btn shadow'
                                                onClick={()=>{
                                                    setPage(1)
                                                    handleShow()
                                                }}
                                                >Enabled</span>
                                    }
                                </h5>                          
                            </td>
                        </tr> 
                        </tbody>               
                    </table>
                    <p className='text-secondary'>toggle to set / disable the 2FA authentication</p>   
                </div>                              
            :null}
           
            {/* popup */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered                
                >
                <Modal.Header>
                <Modal.Title><span className='font-1 display-5 text-primary'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    {page===1?
                            data && data.totpStatus?
                            <div  className="text-center">
                                <p className='text-center font-4 fw-bold'>Are your sure about disabling the 2FA?</p>
                                <button 
                                    className='btn btn-danger fw-bold px-3'
                                    onClick={()=>{toggle(data.totpStatus)}}
                                    >Confirm</button>
                                <button 
                                    className='btn btn-secondary fw-bold px-3 ms-3 px-3'
                                    onClick={()=>{handleClose()}}
                                    >&nbsp;Cancel&nbsp;</button>
                            </div>
                        :
                            <div  className="text-center">
                                <p className='text-center font-4 fw-bold'>Confirm to activate 2FA</p>
                                <button 
                                    className='btn btn-success fw-bold px-3'
                                    onClick={()=>{toggle(data.totpStatus)}}
                                    >Confirm</button>
                                <button 
                                    className='btn btn-secondary fw-bold px-3 ms-3 px-3'
                                    onClick={()=>{handleClose()}}
                                    >&nbsp;Cancel&nbsp;</button>
                            </div>
                    :null}   
                    {page==2?
                        <div className="text-center">
                            <p className=" text-dark text-center mb-0 font-4">Scan the QR code in any TOTP Authenticator! and Enter the code </p>
                            <hr/>
                            <img src={qr} height="200px" width="200px" alt="login image1" className=" my-3"/>
                            <form onSubmit={submitHandlerOTP}>
                            <div className="form-group mb-3">                                    
                                <input 
                                    type="text" 
                                    name="code" 
                                    id="code"
                                    required 
                                    autoFocus
                                    placeholder="enter your OTP"
                                    className="form-control text-secondary font-weight-bold"                                        
                                    value={otp}
                                    onChange={(e)=>{setOTP(e.target.value)}}
                                    />
                            </div>                             
                            <button 
                                className="px-3 py-2 btn btn-block btn-success text-light border shadow font-3 fw-bold me-3" 
                                type="submit"
                                >&nbsp;Verify&nbsp;</button>
                            <button 
                                className="px-3 py-2 btn btn-block btn-secondary text-light border shadow font-3 fw-bold" 
                                type="button"
                                onClick={()=>{
                                    handleClose()
                                    setPage(1)
                                }}
                                >Cancel</button>
                            </form>
                        </div>
                    :null}    
                    {page===3?
                        <div className='text-ceter'>
                            <p className='text-center font-4 fw-bold'>{popupContent}</p>
                            <button 
                                className='btn btn-outline-primary fw-bold px-3 ms-3 px-3 btn-block'
                                onClick={()=>{handleClose()}}
                                >&nbsp;Close&nbsp;</button>
                        </div>                         
                    :null}            
                    
                </Modal.Body>               
            </Modal>               

        </div>
    )
}
export default React.memo(Security);