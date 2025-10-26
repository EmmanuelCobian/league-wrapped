"use client"
import { useState } from 'react';
import Navbar from "./components/wrapped/Navbar";
import LoginScreen from "./components/wrapped/LoginScreen.js";
import LoadingScreen from "./components/wrapped/LoadingScreen.js";
import OverallStats from "./components/wrapped/OverallStats.js";
import MechanicSkills from './components/wrapped/MechanicSkills.js';
import RoleStats from './components/wrapped/RoleStats.js'
import TimePreference from './components/wrapped/TimePreference.js'
import ErrorScreen from './components/wrapped/ErrorScreen.js'
import SummaryScreen from './components/wrapped/SummaryScreen.js';

export default function Home() {
  const [errorMessage, setErrorMessage] = useState('');
  const [wrappedData, setWrappedData] = useState(null);
  const [state, setState] = useState('input')
  const [currScreen, setCurrScreen] = useState(0)

  const fetchData = async (riotId, tagline) => {
    setState('loading')
    setErrorMessage('')
    try {
      const response = await fetch('/api/wrapped', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameName: riotId, tagLine: tagline }),
      });
      const result = await response.json();
      console.log(result)
      if (!result.success) {
        throw new Error(result.error);
      }
      setWrappedData(result.data);
      setState('overall_stats');
      setCurrScreen(0)
    } catch (err) {
      setErrorMessage(err.message)
      setState('error')
    }
  };

  function onNavigate(direction) {
    if (direction == 'prev') setCurrScreen(currScreen-1)
    else if (direction == 'next') setCurrScreen(currScreen+1)
    else if (direction == 'input') handleReset()
    window.scrollTo(0, 0);
  }

  function handleReset() {
    setErrorMessage('')
    setCurrScreen(0)
    setState('input')
  }

  let screens = [
    <OverallStats onNavigate={onNavigate} data={wrappedData} />,
    <MechanicSkills onNavigate={onNavigate} data={wrappedData} />,
    <RoleStats onNavigate={onNavigate} data={wrappedData} />,
    <TimePreference onNavigate={onNavigate} data={wrappedData} />,
    <SummaryScreen onNavigate={onNavigate} data={wrappedData}/>
  ]

  return (
    <>
      <Navbar handleReset={handleReset}/>
      <div className="pt-16">
        {state == 'input' && <LoginScreen fetchData={fetchData} />}
        {state == 'loading' && <LoadingScreen />}
        {state == 'error' && <ErrorScreen errorMessage={errorMessage} handleReset={handleReset} />}
        {state !== 'input' && state !== 'loading' && state !== 'error' && screens[currScreen]}
      </div>
    </>
  )
}