import React, { useState } from 'react';
import firebase from './firebase';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import './App.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState();
  const [otpNumber, setOtpNumber] = useState();
  const configureReCaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      },
      defaultCountry: 'VI'
    }, auth);

  }
  const onSignInSubmit = (e) => {
    e.preventDefault();
    configureReCaptcha();
    // const phoneNumber = getPhoneNumberFromUserInput();
    const appVerifier = window.recaptchaVerifier;

    const auth = getAuth();
    signInWithPhoneNumber(auth, '+84' + phoneNumber, appVerifier)
      .then((confirmationResult) => {

        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        alert('Phone number is valid. Please wait and enter OTP')
        // ...
      }).catch((error) => {
        alert('Phone number is invalid. Please try again')
        // Error; SMS not sent
        // ...
      });
  }
  const otpSubmit = (e) => {
    e.preventDefault();
    window.confirmationResult.confirm(otpNumber).then((result) => {
      // User signed in successfully.
      const user = result.user;
      alert('OTP is valid. Aihi')
      // ...
    }).catch((error) => {
      alert('OTP is invalid. Ahuhu')
      // User couldn't sign in (bad verification code?)
      // ...
    });
  }

  return (
    <div className="App">
      <h1>Trang hâm hấp</h1>
      <h1>Login Form</h1>
      <form onSubmit={e => onSignInSubmit(e)}>
        <div id="sign-in-button"></div>
        <input type="number" value={phoneNumber} name="mobile" placeholder="Mobile Number" required onChange={e => setPhoneNumber(e.target.value)}></input>
        <button type="submit">Submit</button>
      </form>
      <h1>Enter OTP</h1>
      <form onSubmit={e => otpSubmit(e)}>
        <input type="number" value={otpNumber} name="otp" placeholder="OTP Number" required onChange={e => setOtpNumber(e.target.value)}></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
