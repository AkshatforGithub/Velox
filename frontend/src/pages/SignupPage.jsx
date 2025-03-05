import React from 'react'
import { useState } from 'react'

const SignupPage = () => {

  // does not wanna show password or not 
  const [showPassword, setShowPassword] = useState(false);

  // form data
   const[formdata, setFormdata] = useState({
        fullName: '',
        email: '',
        password: '',
      });


  return (
    <div>
    <h1>SignupPage</h1>
    </div>
  )
}

export default SignupPage
