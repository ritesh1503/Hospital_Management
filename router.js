const express = require("express");
const path = require('path');
const router = express.Router();

// Sample credentials for patients and doctors
const credentials = {
    patient: {
        email: "patient@gmail.com",
        password: "pat123"
    },
    doctor: {
        email: "doctor@gmail.com",
        password: "doc123"
    }
};

// login user
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.end("Both email and password are required.");
    }

    if (email.startsWith('pat') && password.startsWith('pat')) {
        if (email === credentials.patient.email && password.startsWith('pat')) {
            req.session.user = email;
            return res.redirect('/route/dashboard');
        } else {
            return res.end("Invalid credentials for a patient.");
        }
    }
     else if (email.startsWith('doc') && password.startsWith('doc')) {
        if (email === credentials.doctor.email && password.startsWith('doc')) {
            req.session.user = email;
            return res.redirect('/route/dashboard');
        } else {
            return res.end("Invalid credentials for a doctor.");
        }
    } else {
        return res.end("Invalid email or password format.");
    }
});

// route for dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        if (req.session.user.startsWith('doc')) {
            // User is a doctor, render dashboard1
            return res.render('dashboard1', { user: req.session.user });
        } else if (req.session.user.startsWith('pat')) {
            // User is a patient, render dashboard2
            return res.render('dashboard2', { user: req.session.user });
        } else {
            return res.send("Unknown User Type");
        }
    } else {
        return res.send("Unauthorized User");
    }
});


// route for logout
router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
            return res.send("Error");
        } else {
            return res.render('base', { title: "Express", logout: "Logout Successful...!" });
        }
    });
});

router.get('/index.html', (req, res) => {
    // Serve the 'index.html' file as a static file if it exists in your project directory
    const indexPath = path.join(__dirname, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            // Handle the error if the file doesn't exist or there's an issue serving it
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;
