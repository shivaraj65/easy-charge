//jshint esversion:8
const express=require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path= require('path');
const mongoose = require('mongoose');
const  cors = require('cors');
const nodemailer = require('nodemailer');
const  hash = require('js-sha512');
const shortid = require('shortid');
const speakeasy =require('speakeasy');
const  QRCode = require('qrcode');
const { ethers } = require('ethers');

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// ------------------------configuration of cors----------------------
var corsOptions = {
  origin: '*',
  credentials:true,
  optionsSuccessStatus: 200
};

//-----------------configuration for the nodemail----------------------

const userMail='';
const passwordMail='';

//----setting up the host for sending the mail
const mailTransporter = nodemailer.createTransport({
    secureConnection: false,
    service: 'gmail',
    auth: {
        user: userMail,
        pass: passwordMail
    }
});

//-----configuration for the coinbase node provider
const provider = new ethers.providers.JsonRpcProvider({
                    url: "https://goerli.ethereum.coinbasecloud.net",
                    user: "",
                    password: ""
                });
const masteraddress="0xC41F62d869cb3F4cF4d81F9Ed89F202b21372F5f";
const masterABI=[
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "authID",
                				"type": "string"
                			},
                			{
                				"internalType": "address",
                				"name": "contAdd",
                				"type": "address"
                			},
                			{
                				"internalType": "uint256",
                				"name": "ind",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "status",
                				"type": "uint256"
                			}
                		],
                		"name": "ActivateCharger",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "timestamp",
                				"type": "string"
                			}
                		],
                		"name": "AddMoney",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "payable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "name",
                				"type": "string"
                			}
                		],
                		"name": "createAccount",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "receiver",
                				"type": "string"
                			},
                			{
                				"internalType": "address",
                				"name": "contAdd",
                				"type": "address"
                			},
                			{
                				"internalType": "uint256",
                				"name": "ind",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "amnt",
                				"type": "uint256"
                			},
                			{
                				"internalType": "string",
                				"name": "timestamp",
                				"type": "string"
                			}
                		],
                		"name": "DeactivateCharger",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "name",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "contact",
                				"type": "string"
                			}
                		],
                		"name": "deployChargingStation",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [],
                		"stateMutability": "nonpayable",
                		"type": "constructor"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "uint256",
                				"name": "amnt",
                				"type": "uint256"
                			}
                		],
                		"name": "withdraw",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "uint256",
                				"name": "i",
                				"type": "uint256"
                			}
                		],
                		"name": "getContract",
                		"outputs": [
                			{
                				"internalType": "address",
                				"name": "",
                				"type": "address"
                			}
                		],
                		"stateMutability": "view",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			}
                		],
                		"name": "getRechargeData",
                		"outputs": [
                			{
                				"components": [
                					{
                						"internalType": "string",
                						"name": "providerName",
                						"type": "string"
                					},
                					{
                						"internalType": "string",
                						"name": "providerAddress",
                						"type": "string"
                					},
                					{
                						"internalType": "uint256",
                						"name": "cost",
                						"type": "uint256"
                					},
                					{
                						"internalType": "string",
                						"name": "date",
                						"type": "string"
                					},
                					{
                						"internalType": "uint256",
                						"name": "transactionWay",
                						"type": "uint256"
                					}
                				],
                				"internalType": "struct manager.RechargeData[]",
                				"name": "",
                				"type": "tuple[]"
                			}
                		],
                		"stateMutability": "view",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			}
                		],
                		"name": "viewUser",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			},
                			{
                				"internalType": "address",
                				"name": "",
                				"type": "address"
                			},
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			},
                			{
                				"internalType": "uint256",
                				"name": "",
                				"type": "uint256"
                			},
                			{
                				"internalType": "int256",
                				"name": "",
                				"type": "int256"
                			}
                		],
                		"stateMutability": "view",
                		"type": "function"
                	}
                ];

const clientContract=[
                	{
                		"inputs": [
                			{
                				"internalType": "address",
                				"name": "managerAddress",
                				"type": "address"
                			},
                			{
                				"internalType": "string",
                				"name": "name",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "contact",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "constructor"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "uint256",
                				"name": "index",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "status",
                				"type": "uint256"
                			}
                		],
                		"name": "UpdateChargingStatus",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "string",
                				"name": "id",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "name",
                				"type": "string"
                			},
                			{
                				"internalType": "string",
                				"name": "location",
                				"type": "string"
                			},
                			{
                				"internalType": "uint256",
                				"name": "chargersCount",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "chargersActive",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "chargePerUnit",
                				"type": "uint256"
                			}
                		],
                		"name": "addChargers",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [],
                		"name": "getChargers",
                		"outputs": [
                			{
                				"components": [
                					{
                						"internalType": "string",
                						"name": "id",
                						"type": "string"
                					},
                					{
                						"internalType": "string",
                						"name": "name",
                						"type": "string"
                					},
                					{
                						"internalType": "string",
                						"name": "location",
                						"type": "string"
                					},
                					{
                						"internalType": "uint256",
                						"name": "chargersCount",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "chargersActive",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "chargePerUnit",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "upvote",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "downvote",
                						"type": "uint256"
                					},
                					{
                						"internalType": "bool",
                						"name": "status",
                						"type": "bool"
                					}
                				],
                				"internalType": "struct ServiceProvider.Chargers[]",
                				"name": "",
                				"type": "tuple[]"
                			}
                		],
                		"stateMutability": "view",
                		"type": "function"
                	},
                	{
                		"inputs": [],
                		"name": "getDetails",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			},
                			{
                				"internalType": "address",
                				"name": "",
                				"type": "address"
                			},
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "view",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "uint256",
                				"name": "i",
                				"type": "uint256"
                			}
                		],
                		"name": "getSpecificCharger1",
                		"outputs": [
                			{
                				"components": [
                					{
                						"internalType": "string",
                						"name": "id",
                						"type": "string"
                					},
                					{
                						"internalType": "string",
                						"name": "name",
                						"type": "string"
                					},
                					{
                						"internalType": "string",
                						"name": "location",
                						"type": "string"
                					},
                					{
                						"internalType": "uint256",
                						"name": "chargersCount",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "chargersActive",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "chargePerUnit",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "upvote",
                						"type": "uint256"
                					},
                					{
                						"internalType": "uint256",
                						"name": "downvote",
                						"type": "uint256"
                					},
                					{
                						"internalType": "bool",
                						"name": "status",
                						"type": "bool"
                					}
                				],
                				"internalType": "struct ServiceProvider.Chargers",
                				"name": "",
                				"type": "tuple"
                			}
                		],
                		"stateMutability": "view",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "uint256",
                				"name": "index",
                				"type": "uint256"
                			},
                			{
                				"internalType": "bool",
                				"name": "status",
                				"type": "bool"
                			}
                		],
                		"name": "setWorkingStatus",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	},
                	{
                		"inputs": [
                			{
                				"internalType": "uint256",
                				"name": "index",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "chargersCount",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "chargePerUnit",
                				"type": "uint256"
                			},
                			{
                				"internalType": "uint256",
                				"name": "chargersActive",
                				"type": "uint256"
                			}
                		],
                		"name": "update",
                		"outputs": [
                			{
                				"internalType": "string",
                				"name": "",
                				"type": "string"
                			}
                		],
                		"stateMutability": "nonpayable",
                		"type": "function"
                	}
                ];

//--------------configuration for the mongoose model for the database------------------
mongoose.connect('');
// mongoose.set('useFindAndModify', false);

//schema for the user
const usersSchema = {
  _id:String,
  authOrigin:String,
  password: String,
  name:String,
  userID:String,
  verified:Boolean,
  tempSecret:String,
  secret:String,
  totpStatus:Boolean
};

const locationSchema={
  lon:Number,
  lat:Number
};

const chargerSchema={
  _id:String,
  location:String,
  city:String,
  state:String,
  contractAddress:String,
  indexLocation:Number,
  status:Boolean,
  loc:locationSchema
};

const User = mongoose.model('User', usersSchema);
const Charger = mongoose.model('Charger',chargerSchema);

//route for the siginup user- website
app.options('/signupW', cors());
app.post('/signupW',async function(req,res){
  const data={
    _id:req.body.Email,
    authOrigin:'website',
    userID:'UID'+shortid.generate(),
    password:hash(req.body.Password),
    name:req.body.Name,
    verified:false,
    tempSecret:'',
    secret:'',
    totpStatus:false
  };
  let checkUser=await User.exists({_id:req.body.Email});
  let response=null;
  if(checkUser===null){
    response = await User.create(data);
  }else{
    res.send({status:'error',message:'user already exist!'});
  }
  if(response!==null){
    let message = {
    from: 'atomifystudios@gmail.com',
    to: req.body.Email,
    subject: 'Welcome to Easy charge | Authentication',
    html: "<!DOCTYPE html><html lang='en' dir='ltr'><head><meta charset='utf-8'><style media='screen'>.top-div {background-color: #1554f0;margin: 0 20px;border-radius: 10px;padding: 20px 10px;color: #fff;}.img {margin: 30px 0;text-align: center;width: 80%;}body {text-align: center;display:flex;}.font-1 {font-size: 1.6rem;}.font-2 {font-size: 1rem;padding-bottom:20px;}.hr {max-width: 30%;margin-top: 40px;margin-bottom: 40px;}.btn {padding: 10px 30px;border-radius: 5px;border: none;background-color: #fff;color: #1554f0;font-size: 1.3rem;font-weight: bolder;margin-top: 100px;text-decoration: none;} a {color: #000;}</style></head><body><table align='center' border='0' cellpadding='0' cellspacing='0'><tr><td align='center'><img class='img' src='https://media.istockphoto.com/vectors/welcome-background-with-colorful-confetti-vector-id843510116?k=20&m=843510116&s=170667a&w=0&h=KpENUYy_7mMO3QVyy9kW5PlWnPfRjD1a2qmXwygT4go=' alt='top banner'/><div class='top-div'><h1 class='font-1'>hi "+req.body.Name+"</h1><h2 class='font-1'>Welcome to Easy Charge</h2><p class='font-2'>thank you for joining with us!</p><h3 class='font-2'>Let's get started</h3><hr class='hr' /><p class='font-2'>You are one step away from getting Authenticated</p><p class='font-2'>click on the button below to activate your ACCOUNT.</p><a class='btn' href='http://localhost:3000/mailauth/"+req.body.Email+"'>VERIFY ACCOUNT</a></div><p class='font-2'>If the Button is not working. <a href='http://localhost:3000/mailauth/"+req.body.Email+"'>click here!</a></p><p class='font-2'>MADE WITH ❤️ IN INDIA</p></td></tr></table></body></html>"
    };
    mailTransporter.sendMail(message, function(err, data) {
      if(err){
        res.send({status:'error',message:'mail not sent! contact supprt.'});
      }else{
        res.send({status:'success',message:'Email has been sent to verify your account. Please check your inbox to proceed'});
      }
    });
  }
});

//route for the verify the email.
app.options('/changeVerification', cors());
app.post('/changeVerification',function(req,res){
  User.findOneAndUpdate({_id:req.body.ID}, { verified:true }, function(err,userdocs){
   if (err) {
     res.send(err);
   }else{
     if(userdocs === null){
       res.send("failed");
     }else{
       res.send("success");
     }
   }
 });
});

//route for the login user- website
app.options('/loginW', cors());
app.post('/loginW',async function(req,res){
  let checkUser=await User.findById(req.body.Email).exec();
  console.log(checkUser);
  if(checkUser!==null){
    if(checkUser.authOrigin==="website"){
      if(checkUser.verified===true){
        if(checkUser.password===hash(req.body.Password)){
            if(checkUser.totpStatus===true){
              res.send({status:'intermediate',message:checkUser});
            }else{
              res.send({status:'success',message:checkUser});
            }
        }else{
          res.send({status:'error',message:'Wrong password.'});
        }
      }else{
        res.send({status:'error',message:'Account not verified. check you mails!'});
      }
      }else{
        res.send({status:'error',message:'This Email has been linked to us using coinbase.'});
      }
  }else{
    res.send({status:'error',message:'user doesnot exist. signup!'});
  }
});

//route for the login totp verification
app.options('/logintotp', cors());
app.post("/logintotp",async function(req,res){
  let base32;
  let verified;
  let checkUser=await User.findById(req.body.Email).exec();
  if(checkUser!==null){
    verified = speakeasy.totp.verify({ secret:checkUser.secret,encoding: 'base32',token: req.body.Token });
    if(verified){
      res.send({status:"success",message:"redirect granted"});
    }else{
      res.send({status:"failed",message:"Invalid TOTP"});
    }
  }else{
    res.send({status:'error',message:'user doesnot exist. signup!'});
  }
});

//route for the set 2FA
app.options('/totpSet', cors());
app.post('/totpSet',async function(req,res){
  let userData=await User.findById(req.body.Email).exec();
  if(req.body.toggle===true){
    //setting the totp
    const secret = speakeasy.generateSecret({name:"Easy Charge | "+req.body.Email});
    let QR;
    QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
    QR=data_url;
    });
    User.findByIdAndUpdate(req.body.Email, { tempSecret:secret.base32 },(err, docs)=>{
      if(err){
        res.send({status:"error",message:"changes not saved. server error"});
      }else{
        res.send({status:'success',message:QR});
      }
    });

  }else{
    //disabling the totp
    User.findByIdAndUpdate(req.body.Email, { totpStatus:false },(err, docs)=>{
      if(err){
        res.send({status:"error",message:"changes not saved. server error"});
      }else{
        res.send({status:'success',message:"2FA removed successfully."});
      }
    });
  }
});

//route for the totp authentication
app.options('/tokenVerify', cors());
app.post("/tokenVerify",function(req,res){
  let base32;
  let verified;
  const dataPromiseChain = new Promise(function(resolve,reject){
    User.findOne({_id: req.body.Email}, function (err, docs){
      if (err) {
        res.send({status:"error"});
        flag="false";
      } else {
          if(docs === null){
             res.send({status:"error",message:"user not exist!"});
             flag="false";
          }else{
            flag="true";
            base32=docs.tempSecret;
            verified = speakeasy.totp.verify({ secret: base32,encoding: 'base32',token: req.body.Token });
          }
        }
        resolve(flag);
    });
  }).then(function(payload){
    if(payload==="true" && verified === true){
      User.findOneAndUpdate({email:req.body.Email}, { secret:base32,totpStatus:true }, function(err,userdocs){
        if (err) {
          res.send(err);
        }else{
          if(userdocs === null){
            res.send({status:"error",message:"server error!"});
          }else{
            res.send({status:"success",message:"successfully added 2FA."});
          }
        }
      });
    }else if(verified === false){
      res.send({status:"failed",message:"Incorrect OTP!"});
    }
  });

});

//route for the coinbase auth
app.options('/coinbaseauth', cors());
app.post('/coinbaseauth',async function(req,res){
  const data={
    _id:req.body.Email,
    userID:'UID'+shortid.generate(),
    authOrigin:'coinbase',
    password:"NA",
    name:req.body.Name,
    verified:true,
    tempSecret:'',
    secret:'',
    totpStatus:false
  };
  let checkUser=await User.exists({_id:req.body.Email});
  let response=null;
  if(checkUser===null){
    response = await User.create(data);
  }else{
    res.send({status:'success',message:checkUser});
  }
  if(response!==null){
    let message = {
    from: 'atomifystudios@gmail.com',
    to: req.body.Email,
    subject: 'Welcome to Easy charge | Authentication',
    html: "<!DOCTYPE html><html lang='en' dir='ltr'><head><meta charset='utf-8'><style media='screen'>.top-div {background-color: #1554f0;margin: 0 20px;border-radius: 10px;padding: 20px 10px;color: #fff;}.img {margin: 30px 0;text-align: center;width: 80%;}body {text-align: center;display:flex;}.font-1 {font-size: 1.6rem;}.font-2 {font-size: 1rem;padding-bottom:20px;}.hr {max-width: 30%;margin-top: 40px;margin-bottom: 40px;}.btn {padding: 10px 30px;border-radius: 5px;border: none;background-color: #fff;color: #1554f0;font-size: 1.3rem;font-weight: bolder;margin-top: 100px;text-decoration: none;} a {color: #000;}</style></head><body><table align='center' border='0' cellpadding='0' cellspacing='0'><tr><td align='center'><img class='img' src='https://media.istockphoto.com/vectors/welcome-background-with-colorful-confetti-vector-id843510116?k=20&m=843510116&s=170667a&w=0&h=KpENUYy_7mMO3QVyy9kW5PlWnPfRjD1a2qmXwygT4go=' alt='top banner'/><div class='top-div'><h1 class='font-1'>hi "+req.body.Name+"</h1><h2 class='font-1'>Welcome to Easy Charge</h2><p class='font-2'>thank you for joining with us!</p><h3 class='font-2'>Let's get started</h3><hr class='hr' /><p class='font-2'>Your Signup with COINBASE is verified.</p></div><p class='font-2'>MADE WITH ❤️ IN INDIA</p></td></tr></table></body></html>"
    };
    mailTransporter.sendMail(message, function(err, data) {
      if(err){
        res.send({status:'error',message:'mail not sent! contact supprt.'});
      }else{
        res.send({status:'success',message:'Email has been sent to verify your account. Please check your inbox to proceed'});
      }
    });
  }
});

//route for coinabse login
app.options('/logincoinbase', cors());
app.post('/logincoinbase',async function(req,res){
    let checkUser=await User.findById(req.body.Email).exec();
    if(checkUser !==null){
        res.send({status:'success',message:checkUser});
    }else{
        res.send({status:'error',message:"User Not exist! signup "});
    }
});

//route for getting user Data
app.options('/getuser', cors());
app.post('/getuser',async function(req,res){
    let checkUser=await User.findById(req.body.Email).exec();
    res.send({status:'success',message:checkUser});
});

//route for creating a new charger entry.
app.options('/setcharger', cors());
app.post('/setcharger',async function(req,res){
  const data={
    _id:""+req.body.contractAddress+req.body.index,
    location:req.body.location,
    city:req.body.city,
    state:req.body.state,
    contractAddress:req.body.contractAddress,
    indexLocation:req.body.index,
    status:req.body.status,
    loc:{
      lon:req.body.lon,
      lat:req.body.lat
    }
  };
  const response = await Charger.create(data);
  if(response!==null){
    res.send({status:'success',message:"charger added to the database"});
  }else{
    res.send({status:'failed',message:"failed to add to the database"});
  }
});

//route forupdating charger status..
app.options('/setcstatus', cors());
app.post('/setcstatus',async function(req,res){
   Charger.findOneAndUpdate({_id:""+req.body.contractAddress+req.body.index}, {status:req.body.status }, function(err,userdocs){
    if (err) {
      res.send(err);
    }else{
      if(userdocs === null){
        res.send({status:"error",message:"server error!"});
      }else{
        res.send({status:"success",message:"successfully updated"});
      }
    }
  });
});

//route forupdating charger status..
app.options('/getchargerz', cors());
app.post('/getchargerz',async function(req,res){
  const docs=await Charger.find({ city: req.body.city }).exec();
  res.send({status:"success",message:docs});
});

//-----------------routes related to the coinbase node-------------------

//route getting data of chargers from individual contracts
app.options('/getchargerdata', cors());
app.post('/getchargerdata',async function(req,res){
//contractAddress
//indexLocation

try{
  const contract =await new ethers.Contract(req.body.contractAddress, clientContract, provider);
  const data=await contract.getSpecificCharger1(req.body.indexLocation).then((res)=>{
      res.send({status:"success",message:data});
  });
}catch(err){
  res.send({status:"failed",message:""});
}


});

//app listening port number
app.listen(process.env.PORT || 3001, function(){
 console.log('Server started on port 3001');
});
