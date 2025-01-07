import React from 'react';
import TopBar from '../Topbar/TopBar';
import Footer from '../Footer/Footer';
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div>
        <TopBar/>
        <div>
            <button><a href='/create'>Create Invoice</a></button>
        </div>
        <Footer/>
    </div>
  )
}

export default Dashboard