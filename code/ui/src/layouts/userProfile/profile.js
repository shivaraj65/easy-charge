import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import './profile.css';
import axios from 'axios'

import Profiles from './subPages/profile'
import Wallet from './subPages/wallet'
import Billing from './subPages/billing'
import Security from './subPages/security'
import Grid from './subPages/grid'

const Profile=()=>{
    let navigate = useNavigate();

    let {email}=useParams();

    const [userData, setUserData] = useState(null);

    const [page, setPage] = useState(1);

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
               setUserData(response.data.message);
            //    setPage(window.sessionStorage.getItem("userPage"))
            }
        })
        .catch(function (error) {                    
            //use the modal for data
            alert("Something went wrong Try Again!");
        });
         
    }, [])
    
    return(
        <div>
            <nav className="navbar navbar-primary bg-primary py-2 px-3" >
                <h1 className="font-1 text-light">Easy Charge</h1>
                <div className='ml-auto font-3'>
                    {/* <span className="text-light fw-bold">contact</span> */}
                    <span 
                        className="mx-4 text-light fw-bold"
                        
                        >Home</span>
                    {/* <button className=' mr-4 btn btn-outline-light font-weight-bold px-3'>Dashboard</button> */}
                    <button 
                        className='btn btn-light fw-bold badge-pill px-3'
                        onClick={()=>{navigate("/")}}
                        >Logout</button>
                </div>
            </nav>
            <div className='mx-4'>
                <div className='row mt-3'>
                    <div className='col-md-3 mb-4'>
                        <div className='card shadow px-2 py-4 text-center'>
                            <h4 
                                className='font-2 text-primary pb-3'                               
                                >Action menu</h4>
                            <hr className='m-0'/>
                            <h5 
                                className='font-3 py-2 hover-menu'
                                onClick={()=>{
                                    setPage(1);
                                    window.sessionStorage.setItem('userPage',1);
                                }}
                                >Profile</h5>
                            <hr className='m-0'/>
                            <h5 
                                className='font-3 py-2 hover-menu'
                                onClick={()=>{
                                    setPage(2);
                                    window.sessionStorage.setItem('userPage',2);
                                }}
                                >Wallet</h5>
                            <hr className='m-0'/>                            
                            <h5 
                                className='font-3 py-2 hover-menu'
                                onClick={()=>{
                                    setPage(3);
                                    window.sessionStorage.setItem('userPage',3);
                                }}
                                >Billing & Usage</h5>
                            <hr className='m-0'/>
                            <h5 
                                className='font-3 py-2 hover-menu'
                                onClick={()=>{
                                    setPage(4);
                                    window.sessionStorage.setItem('userPage',4);
                                }}
                                >Security</h5>
                            <hr className='m-0'/>
                            <h5 
                                className='font-3 py-2 hover-menu'
                                onClick={()=>{
                                    setPage(5);
                                    window.sessionStorage.setItem('userPage',5);
                                }}
                                >Manage your Grid</h5>
                            <hr className='m-0'/>
                            <h5 
                                className='font-3 py-2 text-danger hover-menu-1'
                                onClick={()=>{navigate("/")}}
                                >Logout</h5>
                        </div>
                    </div>
                    <div className='col-md-9 card'>
                        <div>                            
                            { page===1 && userData!==null?<Profiles data={userData} />:null }
                            { page===2 && userData!==null?<Wallet data={userData} />:null }
                            { page===3 && userData!==null?<Billing/>:null }
                            { page===4 && userData!==null?<Security/>:null }
                            { page===5 && userData!==null? <Grid/> :null }
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default React.memo(Profile);