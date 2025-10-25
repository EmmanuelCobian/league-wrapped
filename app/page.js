"use client"
import { useState } from 'react';
import LoginScreen from "./components/wrapped/LoginScreen.js";
import LoadingScreen from "./components/wrapped/LoadingScreen.js";
import OverallStats from "./components/wrapped/OverallStats.js";
import MechanicSkills from './components/wrapped/MechanicSkills.js';
import TeamPlayer from './components/wrapped/TeamPlayer.js'
import RoleStats from './components/wrapped/RoleStats.js'
import TimePreference from './components/wrapped/TimePreference.js'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('login');

  const navigateTo = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  switch (currentPage) {
    case 'login':
      return <LoginScreen onNavigate={navigateTo} />;
    case 'loading':
      return <LoadingScreen onNavigate={navigateTo} />;
    case 'overall_stats':
      return <OverallStats onNavigate={navigateTo} />;
    case 'mechanic':
      return <MechanicSkills onNavigate={navigateTo} />;
    case 'team_player':
      return <TeamPlayer onNavigate={navigateTo} />;
    case 'role':
      return <RoleStats onNavigate={navigateTo} />;
    case 'time_pref':
      return <TimePreference onNavigate={navigateTo} />;
    default:
      return <LoginScreen onNavigate={navigateTo} />;
  }
}