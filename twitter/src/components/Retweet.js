import React, { useState, useEffect } from 'react'

const Retweet = ({ Id }) => {

  const [userData, setUserData] = useState([])

  const fetchUserDetails = () => {
    fetch(`http://localhost:5000/api/user/${Id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
      .then(data => {
        setUserData(data)
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    fetchUserDetails();
  }, [])


  return (
    
      <span className='my-0' style={{fontSize: '14px'}}> @{userData.username}, </span>
    
  )
}

export default Retweet