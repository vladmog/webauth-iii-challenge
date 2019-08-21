const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const moment = require('moment') 

const db = require('./api-model');



    // POST	/api/register

    // Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.

    router.post('/register', (req, res) => {
        const credentials = req.body;
        const hash = bcrypt.hashSync(credentials.password, 14);
        credentials.password = hash;

        db.add(credentials)
            .then((response) => {
                res.status(200).json(response)
            })
            .catch((err) => {
                console.log("ERR", err)
                res.status(500).json(err)
            })
    })
    
    // POST	/api/login

    // Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user 
    // and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code 
    // and the message: 'You shall not pass!'

    router.post('/login', logger, (req, res) => {
        const credentials = req.body
        db.findByUsername(credentials.username)
            .then((user) => {
                if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
                    return res.status(401).json({ error: 'You shall not pass!' });
                } else {
                    req.session.userId = user.id;
                    return res.status(200).json(user)
                }
            })
            .catch(() => {
                res.status(500).json({ message: doh })
            })
        
    })
    
    
    // GET	/api/users
    
    // If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in repond with the 
    // correct status code and the message: 'You shall not pass!'.
    
    router.get('/users', logger, restricted, (req, res) => {
        db.find()
            .then((response) => {
                res.status(200).json(response)
            })
            .catch(() => {
                res.status(500).json({ message: "doh" })
            })
    })

    //DAY2 TK STUFF

      router.get('/makesesh', (req, res) => {
        req.session.name = 'Frodo';
        res.send('got it');
      });
      

      router.get('/getsesh', (req, res) => {
        console.log("GET SESSION", req.session);
        res.send(`hello ${req.session.name}`);
      });


    router.get('/logout', logger, (req, res) => {
        delete req.headers['username'];
        delete req.headers['password'];
        delete req.headers['cookie'];
        if (req.session) {
          req.session.destroy(err => {
            if (err) {
              res.send('error logging out');
            } else {
              res.send('good bye');
            }
          });
        }
      });


    // function restricted(req, res, next) {
    //     // we'll read the username and password from headers
    //     // the client is responsible for setting those headers
    //     const { username, password } = req.headers;
      
    //     // no point on querying the database if the headers are not present
    //     if (username && password) {
    //       db.findByUsername(username)
    //         .then(user => {
    //           if (user && bcrypt.compareSync(password, user.password)) {
    //             next();
    //           } else {
    //             res.status(401).json({ message: 'Invalid Credentials' });
    //           }
    //         })
    //         .catch(error => {
    //           res.status(500).json({ message: 'Unexpected error' });
    //         });
    //     } else {
    //       res.status(400).json({ message: 'No credentials provided' });
    //     }
    //   }

    function restricted(req, res, next) {
        if (req.session && req.session.userId) {
          next();
        } else {
          res.status(401).json({ message: 'you shall not pass!!' });
        }
      }

    function logger(req, res, next) {
        const method = req.method;
        const url = req.url;
        const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
        console.log("########################################################################")
        console.log(`you made a ${method} request to ${url} at ${timestamp}`);
        console.log("########################################################################")
        
        console.log("HEADERS")
        console.log(req.headers)
        console.log("------------------------------------------------------------------------")
        console.log("SESSION")
        console.log(req.session)
        console.log("########################################################################")
        next();
    }

module.exports = router;