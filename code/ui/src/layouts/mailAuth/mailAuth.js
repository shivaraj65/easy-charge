import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Redirecter =()=>{
    let {id}=useParams();
    let navigate = useNavigate();
    useEffect(() => {
        let formData = {ID:id};    
        const config  = {
            headers: {
                'Content-Type' : 'application/json',
                'Access-Control-Allow-Origin':'*',
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }}
        axios.post('http://localhost:3001/changeVerification', 
        JSON.stringify(formData),config)
        .then(function (response) {
            console.log(response.data);
            if(response.data ==="success"){
                navigate("/");
            }else if(response.data ==="failed"){
                alert("Authentication failed!");
                navigate("/");
            }
        })
        .catch(function (error) {
            alert("Error!! Check your Network and Try again.")
        });
     
    }, [])
    
    
    return(
        <div className='bg-auth'>
            <div className='card shadow form-auth-1 text-center'>
                <div>
                    {/* <h1><span className='badge rounded-pill bg-primary'>Verifiying Email</span></h1> */}
                    <h1 className='text-light font-3'> Authenticating &nbsp;
                        <div className="spinner-grow text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </h1>                   
                </div>                
            </div>                        
        </div>
    )
}
export default React.memo(Redirecter);