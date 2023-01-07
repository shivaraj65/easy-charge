import React from 'react';
import './landing.css'
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LazyMotion, domAnimation, m } from "framer-motion";

 const Landing=()=>{
    let navigate = useNavigate();

    return(
        <div>
            <nav className="navbar navbar-primary bg-primary py-2 px-3" >
                <h1 className="font-1 text-light">Easy Charge</h1>
                <div className='ml-auto font-3'>
                    {/* <span className="text-light fw-bold">contact</span> */}
                    {/* <span 
                        className="mx-4 text-light fw-bold"
                        
                        >Home</span> */}
                    {/* <button className=' mr-4 btn btn-outline-light font-weight-bold px-3'>Dashboard</button> */}
                    <button 
                        className='btn btn-light fw-bold badge-pill px-3'
                        onClick={()=>{navigate("/signup")}}
                        >Signup</button>
                </div>
            </nav>
            <div className='landing-image'>
                 <div className='container pt-5 custom-center'>
                    <h1 className='display-1 font-1 text-primary mb-3'>Easy Charge</h1>
                    <h3 className='font-2 text-dark mt-4 mb-2'>World's first public EV charging network.</h3>
                    <h4 className='font-3 text-light my-5'>Built with <span className='font-4 fw-bold badge rounded-pill bg-primary'>COINBASE</span> & <img src="https://img.icons8.com/color/40/null/ethereum.png"/></h4>
                    <button className='btn btn-dark fw-bold landing-btn font-3 btn-lg' onClick={()=>{navigate("/signup")}}>Signup</button>
                    <button className='btn btn-outline-primary ms-3 fw-bold landing-btn font-3 btn-lg' onClick={()=>{navigate("/login")}}>Login</button>
                </div>
            </div>           
            <div className='my-5 py-4 container text-center'>
                    <h1 className='text-secondary font-2'>Currently available in three major cities</h1>                    
                    <table className="table borderless font-3 my-5 text-success">
                        <tbody>
                            <td className='h3'>
                                <motion.h3
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.9 }}
                                >Coimbatore</motion.h3>
                            </td>
                            <td className='h3'>
                                <motion.h3
                                    whileHover={{ scale: 1.4 }}
                                    whileTap={{ scale: 0.9 }}
                                >Chennai</motion.h3>
                            </td>
                            <td className='h3'>
                                <motion.h3
                                    whileHover={{ scale: 1.3 }}
                                    whileTap={{ scale: 0.9 }}
                                >Bengaluru</motion.h3>
                            </td>
                        </tbody>
                    </table>
                    <hr/>
                    <div className="row">
                    <div className="col-md-4 text-center">   
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            >
                            <div className="mt-5 card shadow p-4">
                            <img className="icon-size" src="https://img.icons8.com/external-vitaliy-gorbachev-flat-vitaly-gorbachev/512/null/external-blockchain-cryptocurrency-vitaliy-gorbachev-flat-vitaly-gorbachev-1.png"/>
                            <h3 className="h4 my-3 font-3 text-primary">DECENTRALISED</h3>
                            <p className="text-muted mb-0">Separated by Region - United by Service</p>
                        </div>
                        </motion.div>                                             
                    </div>
                    <div className="col-md-4 text-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            >
                            <div className="mt-5 card shadow p-4">
                                <img className="icon-size" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/512/null/external-consent-cyber-security-flaticons-lineal-color-flat-icons.png"/>
                                <h3 className="h4 my-3 font-3 text-primary">TRANSPARENCY</h3>
                                <p className="text-muted mb-0">Transaction are secure and fast</p>
                            </div>
                        </motion.div>                        
                    </div>
                    <div className="col-md-4  text-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            >
                            <div className="mt-5 card shadow p-4">
                                <img className="icon-size" src="https://img.icons8.com/ultraviolet/512/null/low-price.png"/>
                                <h3 className="h4 my-3 font-3 text-primary">LOW COST</h3>
                                <p className="text-muted mb-0">Quick and Automatic payments</p>
                            </div>
                        </motion.div>                        
                    </div>                    
                </div>
                </div>                
                <footer className="bg-primary py-5 mt-5">
                    <div className="container">
                        <p className='text-center font-3 text-light'>Made with ❤️ in INDIA</p>
                        <div className="small text-center text-light font-4">Copyright © Then, Now & Forever - Easy Charge</div>
                    </div>
                </footer>
                
        </div>
    )
 }
 export default React.memo(Landing);