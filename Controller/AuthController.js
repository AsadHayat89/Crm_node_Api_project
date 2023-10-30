const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const UserScehem=require("../Model/AuthModel");
const jwt = require('jsonwebtoken');

exports.SignUP=async (req, res) => {
    const { fullName, userName, email, password,type } = req.body;
   
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const existingUser = await UserScehem.findOne({ email });
      if (existingUser) throw new Error('Email already registered');
  
      const user = await UserScehem.create({ fullName, userName, email, password: hashedPassword,type });
        const token = jwt.sign({ userId: user._id }, 'secretKey');
        res.status(201).json({status:"success", responce:user });
  
      
    } catch (error) {
      res.status(200).json({status:"error", error: error.message });
    }
  };

exports.GetUserByEmail=async (req, res) => {
    const { email} = req.body;
  
    try {
      const user = await UserScehem.findOne({ email });
      if (!user) throw new Error('User not found');
      user.password=undefined;
      res.status(200).json({status:"success", responce:user });
    } catch (error) {
      res.status(200).json({status:"error", error: error.message });
    }
  };

  exports.Login=async (req, res) => {
    console.log(req.body.email);
    const { email, password } = req.body;
  
    try {
      const user = await UserScehem.findOne({ email });
      if (!user) throw new Error('User not found');
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw new Error('Invalid login credentials');
  
      const token = jwt.sign({ userId: user._id }, 'secretKey');
      res.status(200).json({status:"success", responce:user });
    } catch (error) {
      res.status(200).json({status:"error", error: error.message });
    }
  };

exports.Profile=async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'secretKey');
      const user = await UserScehem.findById(decoded.userId);
      if (!user) throw new Error('User not found');
      const { fullName, userName, email } = user;
      res.status(200).json({ fullName, userName, email });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };