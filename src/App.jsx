import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics'; 
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  Tooltip, BarChart, Bar, Cell 
} from 'recharts';

// --- Analytics Helper ---
const trackEvent = (eventName, data = {}) => {
  track(eventName, data);
  console.log(`[Analytics] ${eventName}`, data);
  if (typeof window.gtag !== 'undefined') {
     // window.gtag('event', eventName, data);
  }
};

// --- Icon Definitions ---

const Icons = {
  // Store Icons
  Apple: (props) => (
    <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
    </svg>
  ),
  GooglePlay: (props) => (
    <svg viewBox="0 0 512 512" fill="currentColor" {...props}>
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l220.7-221.3-58.7-58.7L46.6 502c17.5 10.9 40.5 7.8 58-3z"/>
    </svg>
  ),
  // Moon Phases
  MoonNew: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillOpacity="0.05" d="M12 2.25a9.75 9.75 0 1 1 0 19.5 9.75 9.75 0 0 1 0-19.5Z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" d="M12 2.25a9.75 9.75 0 1 1 0 19.5 9.75 9.75 0 0 1 0-19.5Z" />
    </svg>
  ),
  MoonWaxingCrescent: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" fillOpacity="0.1" />
      <path d="M12 2.25 a9.75 9.75 0 0 1 0 19.5 a7 9.75 0 0 0 0 -19.5" />
    </svg>
  ),
  MoonFirstQuarter: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" fillOpacity="0.1" />
      <path d="M12 2.25 a9.75 9.75 0 0 1 0 19.5 L12 2.25 Z" />
    </svg>
  ),
  MoonWaxingGibbous: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" fillOpacity="0.1" />
      <path d="M12 2.25 a9.75 9.75 0 0 1 0 19.5 a6 9.75 0 0 1 0 -19.5" />
    </svg>
  ),
  MoonFull: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" />
    </svg>
  ),
  MoonWaningGibbous: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" fillOpacity="0.1" />
      <path d="M12 2.25 a9.75 9.75 0 0 0 0 19.5 a6 9.75 0 0 0 0 -19.5" />
    </svg>
  ),
  MoonLastQuarter: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" fillOpacity="0.1" />
      <path d="M12 2.25 a9.75 9.75 0 0 0 0 19.5 L12 2.25 Z" />
    </svg>
  ),
  MoonWaningCrescent: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.75" fillOpacity="0.1" />
      <path d="M12 2.25 a9.75 9.75 0 0 0 0 19.5 a7 9.75 0 0 1 0 -19.5" />
    </svg>
  ),

  // Weather Icons
  Moon: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
  ),
  Sun: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ),
  Cloud: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.25-10.5Z" />
    </svg>
  ),
  CloudRain: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
       <path d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.25-10.5Z" />
       <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 22v2M14 22v2" />
    </svg>
  ),
  CloudSnow: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.75 6.75a6 6 0 0 0-11.25 3 5.25 5.25 0 0 0 2.25 10.5h11.25a4.5 4.5 0 0 0 2.213-8.373 3.75 3.75 0 0 0-4.463-5.127z" />
      <circle cx="10" cy="22" r="1.5" />
      <circle cx="16" cy="22" r="1.5" />
      <circle cx="13" cy="22" r="1.5" />
    </svg>
  ),
  Wind: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M14.625 12a4.5 4.5 0 1 1-3.69-7.07 1.5 1.5 0 0 1 1.838 2.378A1.5 1.5 0 0 0 11.25 9.75H3a.75.75 0 0 0 0 1.5h11.625zM12.938 15.375A.75.75 0 0 1 13.5 15h3a3 3 0 1 0-3-3 .75.75 0 0 1-1.5 0 4.5 4.5 0 1 1 3.407 4.265.75.75 0 0 1-.469-1.89z" clipRule="evenodd" />
    </svg>
  ),
  CloudLightning: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.5 9.75a6 6 0 0 1 11.573-2.226 3.75 3.75 0 0 1 4.133 4.303A4.5 4.5 0 0 1 18 20.25H6.75a5.25 5.25 0 0 1-2.25-10.5Z" />
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 22l-3-4h3l-1.5-4" />
    </svg>
  ),
  
  // UI Icons
  Search: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
    </svg>
  ),
  MapPin: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742zM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" clipRule="evenodd" />
    </svg>
  ),
  X: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06-1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  ),
  ChevronDown: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
    </svg>
  ),
  RefreshCw: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h5.5a.75.75 0 0 0 .75-.75v-5.5a.75.75 0 0 0-1.5 0v3.183l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0-.75.75v5.5a.75.75 0 0 0 1.5 0v-3.183l1.9 1.9a9 9 0 0 0 15.559-4.509.75.75 0 0 0-.53-.919Z" clipRule="evenodd" />
    </svg>
  ),
  Loader2: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" opacity="0.5"/> 
      <path d="M4.75 12a7.25 7.25 0 1114.5 0 7.25 7.25 0 01-14.5 0z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="16 30"/> 
    </svg>
  ),
  Droplets: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
  ),
  Eye: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
    </svg>
  ),
  Thermometer: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M13.5 4.5a1.5 1.5 0 0 0-3 0v8.638a4.5 4.5 0 1 0 3 0V4.5ZM12 0a3 3 0 0 0-3 3v8.32a6 6 0 1 0 6 0V3a3 3 0 0 0-3-3Z" clipRule="evenodd" />
      <circle cx="12" cy="16.5" r="3" />
    </svg>
  ),
  Gauge: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.619-.481 1.035l2.75 3.3a.75.75 0 0 1 1.156-.962l-2.75-3.3a.75.75 0 0 1-.675-.073Z" clipRule="evenodd" />
    </svg>
  ),
  Sunrise: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Zm0 15a6 6 0 0 1-6-6 .75.75 0 0 1 1.5 0 4.5 4.5 0 1 0 9 0 .75.75 0 0 1 1.5 0 6 6 0 0 1-6 6Zm-7.5-6a.75.75 0 0 1 .75.75 8.25 8.25 0 0 0 13.5 0 .75.75 0 0 1 1.5 0c.93 1.55 2.053 2.5 3.375 2.5a.75.75 0 0 1 0 1.5H.375a.75.75 0 0 1 0-1.5c1.322 0 2.445-.95 3.375-2.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  ),
  Sunset: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 17.25a.75.75 0 0 1 .75-.75v-4.5a.75.75 0 0 1-1.5 0v4.5a.75.75 0 0 1 .75.75Zm0-15a6 6 0 0 1 6 6 .75.75 0 0 1-1.5 0 4.5 4.5 0 1 0-9 0 .75.75 0 0 1-1.5 0 6 6 0 0 1 6-6Zm-7.5 6a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 0 13.5 0 .75.75 0 0 1 1.5 0c.93-1.55 2.053-2.5 3.375-2.5a.75.75 0 0 1 0-1.5H.375a.75.75 0 0 1 0 1.5c1.322 0 2.445.95 3.375 2.5a.75.75 0 0 1 .75.75Z" clipRule="evenodd" />
    </svg>
  ),
  Download: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  ),
  Share: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
    </svg>
  ),
  AlertTriangle: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  ),
  Check: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
    </svg>
  )
};

// --- Shared Constants & Helpers ---

const weatherIcons = {
  sunny: Icons.Sun,
  cloudy: Icons.Cloud,
  rainy: Icons.CloudRain,
  snowy: Icons.CloudSnow,
  windy: Icons.Wind,
  stormy: Icons.CloudLightning,
};

// Map WMO weather codes to our simplified conditions
const getWeatherCondition = (code) => {
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'cloudy'; // Fog
  if (code >= 51 && code <= 67) return 'rainy';
  if (code >= 71 && code <= 77) return 'snowy';
  if (code >= 80 && code <= 82) return 'rainy';
  if (code >= 85 && code <= 86) return 'snowy';
  if (code >= 95 && code <= 99) return 'stormy';
  return 'sunny';
};

// ... helper to get moon phase icon key based on date
const getMoonPhaseIcon = (date) => {
    // Precise Moon Phase Calculation (Astronomical Julian Day)
    
    // 1. Get UTC components to avoid timezone offsets causing day shifts
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    
    // 2. Calculate Julian Day Number (JDN)
    // Formula valid for Gregorian calendar (1582+)
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    // Julian Day Number for the start of the day (noon UTC technically, but...)
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Add time fraction (Julian Date usually starts at noon, so we adjust)
    // JD = JDN + (Hour - 12) / 24 + Minute / 1440 ...
    // Simplified to: JDN + TimeFraction - 0.5
    const jd = jdn + (hours / 24) - 0.5;

    // 3. Known New Moon Reference (Jan 6, 2000 at 18:14 UTC = JD 2451550.1)
    const knownNewMoon = 2451550.1; 
    const lunarCycle = 29.53058867; // Synodic month length
    
    // 4. Calculate Phase
    const daysSince = jd - knownNewMoon;
    const cycles = daysSince / lunarCycle;
    const currentPhase = cycles - Math.floor(cycles); // 0.0 to 1.0
    
    // 5. Map 0.0-1.0 to 0-7 Index
    // 0: New (0.9375 - 0.0625)
    // 1: Waxing Crescent (0.0625 - 0.1875)
    // 2: First Quarter (0.1875 - 0.3125)
    // 3: Waxing Gibbous (0.3125 - 0.4375)
    // 4: Full (0.4375 - 0.5625)
    // 5: Waning Gibbous (0.5625 - 0.6875)
    // 6: Last Quarter (0.6875 - 0.8125)
    // 7: Waning Crescent (0.8125 - 0.9375)
    
    // Adding 0.5/8 (half a step) shifts the boundaries so that "0" is centered around 0.0/1.0
    // Then floor it.
    let index = Math.floor(currentPhase * 8 + 0.5);
    
    // Wrap around (if index hits 8, it means New Moon again)
    if (index >= 8) index = 0;
    
    switch(index) {
        case 0: return Icons.MoonNew;
        case 1: return Icons.MoonWaxingCrescent;
        case 2: return Icons.MoonFirstQuarter;
        case 3: return Icons.MoonWaxingGibbous;
        case 4: return Icons.MoonFull;
        case 5: return Icons.MoonWaningGibbous;
        case 6: return Icons.MoonLastQuarter;
        case 7: return Icons.MoonWaningCrescent;
        default: return Icons.MoonFull;
    }
}

// --- Helper Components ---

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-800 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// --- NEW: Store Buttons Component ---
const StoreButtons = ({ onDownloadClick, isDark }) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
    <button
      onClick={onDownloadClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
        isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'
      }`}
    >
      <Icons.Apple className="w-6 h-6" />
      <div className="text-left">
        <div className="text-[10px] leading-tight">Download on the</div>
        <div className="text-sm font-semibold leading-tight">App Store</div>
      </div>
    </button>
    
    <button
      onClick={onDownloadClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
        isDark 
          ? 'border-white/20 text-white hover:bg-white/10' 
          : 'border-gray-300 text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icons.GooglePlay className="w-5 h-5" />
      <div className="text-left">
        <div className="text-[10px] leading-tight">GET IT ON</div>
        <div className="text-sm font-semibold leading-tight">Google Play</div>
      </div>
    </button>
  </div>
);

// --- NEW: Email Capture Modal (The "Intercept") ---
// Updated to use a bottom sheet style on mobile to avoid keyboard issues
function EmailCaptureModal({ isOpen, onClose, isDark }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      // 1. Track the event
      trackEvent('Email Submitted', { source: 'Store Intercept' });
      
      // 2. Set loading state
      setIsSubmitting(true);

      try {
        // 3. Send to Vercel API function
        const response = await fetch('/api/submit-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          // Handle error (optional, for now just log)
          console.error("Submission failed");
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 z-[70] w-full p-6 rounded-t-3xl shadow-2xl md:top-1/2 md:left-1/2 md:bottom-auto md:w-full md:max-w-sm md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl ${
              isDark ? 'bg-slate-900 border-t md:border border-white/10' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {isSubmitted ? "You're on the list!" : "Coming Soon"}
              </h3>
              <button onClick={onClose}>
                <Icons.X className={`w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                    <Icons.Check className="w-6 h-6" />
                </div>
                <p className={`mb-2 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
                  Thanks! We'll notify you when the app is ready for download.
                </p>
                <button 
                    onClick={onClose}
                    className={`mt-4 text-sm font-medium ${isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    Close
                </button>
              </div>
            ) : (
              <>
                <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  Currents for iOS and Android is almost ready. Enter your email to get early access and be notified when we go live.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4 pb-4 md:pb-0">
                  <Input 
                    ref={inputRef}
                    type="email" 
                    placeholder="Enter your email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className={isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : ''}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center ${
                      isDark 
                        ? 'bg-white text-slate-900 hover:bg-gray-100' 
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <Icons.Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Notify Me"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- Main Components ---

function ScrollIndicator({ isDark, onClick }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
    >
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icons.ChevronDown 
          className={`w-6 h-6 ${isDark ? 'text-white/30 hover:text-white/50' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
        />
      </motion.div>
    </motion.div>
  );
}

function WeatherCard({ title, value, unit, icon: Icon, subtitle, isDark, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`p-5 rounded-2xl ${isDark ? 'bg-white/5 hover:bg-white/8' : 'bg-white hover:bg-gray-50'} transition-all duration-300 shadow-sm`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
          {title}
        </p>
        {Icon && (
          <Icon className={`w-5 h-5 ${isDark ? 'text-white/30' : 'text-gray-300'}`} />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-light ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {value}
        </span>
        {unit && (
          <span className={`text-lg ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
            {unit}
          </span>
        )}
      </div>
      {subtitle && (
        <p className={`text-sm mt-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

function TemperatureChart({ data, isDark, unit }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-4 py-3 rounded-xl shadow-lg ${isDark ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-100'}`}>
          <p className={`text-xs uppercase tracking-widest mb-1 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
            {label}
          </p>
          <p className={`text-lg font-light ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {Math.round(Number(payload[0].value))}°{unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`p-6 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-white'} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
          24-Hour Temperature
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-orange-400" />
            <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Today</span>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? "#60a5fa" : "#3b82f6"} stopOpacity={0.4} />
                <stop offset="50%" stopColor={isDark ? "#f97316" : "#f59e0b"} stopOpacity={0.2} />
                <stop offset="100%" stopColor={isDark ? "#f97316" : "#f59e0b"} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `${Math.round(Number(value))}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="url(#lineGradient)"
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function PrecipitationChart({ data, isDark }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-4 py-3 rounded-xl shadow-lg ${isDark ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-100'}`}>
          <p className={`text-xs uppercase tracking-widest mb-1 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
            {label}
          </p>
          <p className={`text-lg font-light ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {payload[0].value}% chance
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`p-6 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-white'} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
          Precipitation Probability
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Rain</span>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} />
            <Bar 
              dataKey="precipitation" 
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.precipitation > 50 
                    ? (isDark ? '#22d3ee' : '#06b6d4') 
                    : (isDark ? 'rgba(34, 211, 238, 0.4)' : 'rgba(6, 182, 212, 0.4)')} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function HourlyForecast({ data, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`p-6 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-white'} shadow-sm overflow-hidden`}
    >
      <h3 className={`text-sm uppercase tracking-widest mb-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
        Hourly Forecast
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {data.map((hour, index) => {
          const Icon = weatherIcons[hour.condition] || Icons.Sun;
          return (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col items-center min-w-[70px] py-4 px-3 rounded-2xl ${
                hour.isNow 
                  ? (isDark ? 'bg-white/10' : 'bg-gray-100') 
                  : 'hover:bg-white/5'
              } transition-colors`}
            >
              <span className={`text-xs mb-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {hour.isNow ? 'Now' : hour.time}
              </span>
              <Icon 
                className={`w-6 h-6 mb-3 ${isDark ? 'text-white/60' : 'text-gray-500'}`}
              />
              <span className={`text-lg font-light ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {Math.round(Number(hour.temp))}°
              </span>
              {hour.precipitation > 0 && (
                <span className={`text-xs mt-2 text-cyan-400`}>
                  {hour.precipitation}%
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DailyForecast({ data, isDark }) {
  const maxTemp = Math.max(...data.map(d => d.high));
  const minTemp = Math.min(...data.map(d => d.low));
  const range = maxTemp - minTemp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`p-6 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-white'} shadow-sm`}
    >
      <h3 className={`text-sm uppercase tracking-widest mb-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
        7-Day Forecast
      </h3>
      
      <div className="space-y-4">
        {data.map((day, index) => {
          const Icon = weatherIcons[day.condition] || Icons.Sun;
          // Avoid division by zero if range is 0
          const leftPos = range === 0 ? 0 : ((day.low - minTemp) / range) * 100;
          const width = range === 0 ? 100 : ((day.high - day.low) / range) * 100;
          
          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 py-3 ${
                index !== data.length - 1 
                  ? (isDark ? 'border-b border-white/5' : 'border-b border-gray-100') 
                  : ''
              }`}
            >
              <span className={`w-12 text-sm ${day.isToday ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-white/60' : 'text-gray-600')}`}>
                {day.isToday ? 'Today' : day.day}
              </span>
              
              <Icon 
                className={`w-5 h-5 ${isDark ? 'text-white/50' : 'text-gray-400'}`}
              />
              
              {day.precipitation > 0 && (
                <span className="text-xs text-cyan-400 w-8">
                  {day.precipitation}%
                </span>
              )}
              {day.precipitation === 0 && <span className="w-8" />}
              
              <span className={`w-8 text-right text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {Math.round(Number(day.low))}°
              </span>
              
              <div className="flex-1 h-1.5 rounded-full relative mx-2 bg-gradient-to-r from-blue-400/20 to-orange-400/20">
                <div 
                  className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                  style={{ 
                    left: `${leftPos}%`, 
                    width: `${width}%` 
                  }}
                />
              </div>
              
              <span className={`w-8 text-sm ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
                {Math.round(Number(day.high))}°
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function WeatherDetails({ weatherData, isDark, unit, onRefresh, isRefreshing, onDownloadClick }) {
  return (
    <div className={`min-h-screen py-16 px-4 md:px-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-2xl md:text-3xl font-light mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Weather Details
          </h2>
          <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            Detailed forecast and conditions
          </p>
        </motion.div>

        {/* Hourly Forecast */}
        <div className="mb-6">
          <HourlyForecast data={weatherData.hourly} isDark={isDark} />
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <TemperatureChart data={weatherData.temperatureChart} isDark={isDark} unit={unit} />
          <PrecipitationChart data={weatherData.precipitationChart} isDark={isDark} />
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <WeatherCard
            title="Humidity"
            value={weatherData.humidity}
            unit="%"
            icon={Icons.Droplets}
            subtitle={`Dew point ${Math.round(Number(weatherData.dewPoint))}°`}
            isDark={isDark}
            delay={0}
          />
          <WeatherCard
            title="Wind"
            value={weatherData.windSpeed}
            unit="mph"
            icon={Icons.Wind}
            subtitle={`Gusts up to ${weatherData.windGust} mph`}
            isDark={isDark}
            delay={0.05}
          />
          <WeatherCard
            title="Visibility"
            value={weatherData.visibility ? Math.round(Number(weatherData.visibility)) : 10}
            unit="mi"
            icon={Icons.Eye}
            subtitle={weatherData.visibility > 5 ? "Clear conditions" : "Reduced visibility"}
            isDark={isDark}
            delay={0.1}
          />
          <WeatherCard
            title="Feels Like"
            value={Math.round(Number(weatherData.feelsLike))}
            unit="°"
            icon={Icons.Thermometer}
            subtitle="Similar to actual"
            isDark={isDark}
            delay={0.15}
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <WeatherCard
            title="Pressure"
            value={weatherData.pressure}
            unit="hPa"
            icon={Icons.Gauge}
            subtitle="Stable"
            isDark={isDark}
            delay={0.2}
          />
          <WeatherCard
            title="UV Index"
            value={weatherData.uvIndex}
            icon={Icons.Sun}
            subtitle={weatherData.uvIndex <= 2 ? "Low" : weatherData.uvIndex <= 5 ? "Moderate" : "High"}
            isDark={isDark}
            delay={0.25}
          />
          <WeatherCard
            title="Sunrise"
            value={weatherData.sunrise}
            icon={Icons.Sunrise}
            isDark={isDark}
            delay={0.3}
          />
          <WeatherCard
            title="Sunset"
            value={weatherData.sunset}
            icon={Icons.Sunset}
            isDark={isDark}
            delay={0.35}
          />
        </div>

        {/* Daily Forecast */}
        <DailyForecast data={weatherData.daily} isDark={isDark} />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`text-center mt-12 py-8 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            
            {/* Store Buttons Added Here */}
            <div className="mb-4">
                <p className={`text-xs uppercase tracking-widest mb-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    Get the full experience
                </p>
                <StoreButtons onDownloadClick={onDownloadClick} isDark={isDark} />
            </div>

            <div className="flex items-center justify-center gap-3">
              <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                Weather data refreshed at {weatherData.lastUpdated}
              </p>
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={`p-1.5 rounded-full transition-all ${
                  isDark 
                    ? 'text-white/30 hover:text-white/60 hover:bg-white/5' 
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Refresh weather data"
              >
                <Icons.RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function LocationSelector({ isOpen, onClose, onSelectLocation, currentLocation, isDark, onDownloadClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=5&language=en&format=json`
          );
          const data = await response.json();
          if (data.results) {
             setSearchResults(data.results.map(r => ({
                 name: r.name,
                 country: r.country,
                 lat: r.latitude,
                 lon: r.longitude,
                 admin1: r.admin1 // Region/State
             })));
          } else {
             setSearchResults([]);
          }
        } catch (e) {
          console.error("Search failed", e);
          setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        onSelectLocation({
          name: 'Current Location',
          lat: latitude,
          lon: longitude,
          isCurrentLocation: true
        });
        setIsLocating(false);
        onClose();
      },
      (error) => {
        setLocationError('Unable to get your location. Please enable location access.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSelectCity = (city) => {
    onSelectLocation({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 z-50 w-full rounded-t-3xl shadow-2xl flex flex-col max-h-[80vh] md:top-20 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-2xl md:mx-4 ${
              isDark ? 'bg-slate-900 border-t md:border border-white/10' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
              <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Change Location
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
              >
                <Icons.X className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Icons.Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/30' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>

              {/* Current Location Button */}
              <button
                onClick={handleGetCurrentLocation}
                disabled={isLocating}
                className={`w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl transition-colors ${
                  isDark ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {isLocating ? (
                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icons.MapPin className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isLocating ? 'Locating...' : 'Use Current Location'}
                </span>
              </button>

              {locationError && (
                <p className="mt-2 text-xs text-red-400 text-center">{locationError}</p>
              )}
            </div>

            {/* Results / Popular Cities */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {searchQuery.length < 2 ? (
                <div className="p-2">
                  <p className={`px-4 py-2 text-xs uppercase tracking-wider font-medium ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                    Popular Cities
                  </p>
                  {[
                    { name: 'New York', country: 'USA', lat: 40.71, lon: -74.01 },
                    { name: 'Los Angeles', country: 'USA', lat: 34.05, lon: -118.24 },
                    { name: 'London', country: 'UK', lat: 51.51, lon: -0.13 },
                    { name: 'Tokyo', country: 'Japan', lat: 35.69, lon: 139.69 },
                    { name: 'Paris', country: 'France', lat: 48.85, lon: 2.35 },
                    { name: 'Sydney', country: 'Australia', lat: -33.87, lon: 151.21 },
                  ].map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleSelectCity(city)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                        isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-50 text-gray-900'
                      } transition-colors text-left`}
                    >
                      <span className="text-sm">{city.name}</span>
                      <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {city.country}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-2">
                  {isSearching ? (
                    <div className="p-4 text-center">
                      <Icons.Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectCity(result)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
                          isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-50 text-gray-900'
                        } transition-colors text-left`}
                      >
                        <span className="text-sm">{result.name}</span>
                        <div className="text-right">
                          <span className={`text-xs block ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                            {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        No results found
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Store Buttons Footer within Modal */}
            <div className={`p-4 border-t mt-auto ${isDark ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
               <p className={`text-xs uppercase tracking-widest text-center mb-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    Available soon on mobile
                </p>
               <StoreButtons onDownloadClick={onDownloadClick} isDark={isDark} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function WeatherHero({ 
  weatherData, 
  location,
  isDark, 
  onLocationClick, 
  onboardingStep = 0, 
  handleOnboardingLocation, 
  handleOnboardingUnit 
}) {
  const [inputValue, setInputValue] = useState('');

  const getGradient = () => {
    // Return neutral gradient during onboarding if we don't know the weather yet
    if (onboardingStep > 0) {
      return isDark ? 'from-slate-900 via-gray-900 to-slate-900' : 'from-gray-100 via-white to-gray-100';
    }

    if (isDark) {
      switch (weatherData?.condition) {
        case 'rainy': return 'from-slate-900 via-slate-800 to-slate-900';
        case 'stormy': return 'from-gray-900 via-purple-950 to-gray-900';
        case 'snowy': return 'from-slate-800 via-blue-950 to-slate-900';
        case 'cloudy': return 'from-gray-900 via-slate-800 to-gray-900';
        default: return 'from-slate-900 via-indigo-950 to-slate-900';
      }
    } else {
      switch (weatherData?.condition) {
        case 'rainy': return 'from-slate-200 via-blue-100 to-slate-200';
        case 'stormy': return 'from-slate-300 via-purple-100 to-slate-200';
        case 'snowy': return 'from-slate-100 via-blue-50 to-white';
        case 'cloudy': return 'from-gray-200 via-slate-100 to-gray-200';
        default: return 'from-amber-50 via-orange-50 to-yellow-50';
      }
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleOnboardingLocation(inputValue);
    }
  };

  const locationText = onboardingStep === 1 
    ? "SET YOUR LOCATION" 
    : (location?.name || weatherData?.location || 'Select Location');

  const MoonIcon = weatherData?.currentTemp && weatherData.isDay === 0
      ? getMoonPhaseIcon(new Date()) 
      : Icons.Moon;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-8 bg-gradient-to-br ${getGradient()} relative overflow-hidden transition-colors duration-1000`}>
      {/* Ambient circles */}
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-3xl ${isDark ? 'bg-blue-900/10' : 'bg-blue-200/30'}`}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: '10%', left: '-10%' }}
      />
      <motion.div
        className={`absolute w-[400px] h-[400px] rounded-full blur-3xl ${isDark ? 'bg-purple-900/10' : 'bg-orange-200/20'}`}
        animate={{
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: '20%', right: '-5%' }}
      />

      {/* Moon Icon for Night (Subtle Background) */}
      {!onboardingStep && !isDark ? null : weatherData?.currentTemp && weatherData.isDay === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-20%] right-[-20%] text-white/5 pointer-events-none z-0 blur-xl"
        >
          <MoonIcon className="w-[80rem] h-[80rem]" />
        </motion.div>
      )}

      {/* Location - Top of screen */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onLocationClick}
        className={`absolute top-8 left-1/2 -translate-x-1/2 text-sm uppercase tracking-[0.3em] ${isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-500 hover:text-gray-700'} transition-colors cursor-pointer flex items-center gap-2 group z-10`}
      >
        <span>
            {locationText}
        </span>
        <svg 
        className={`w-3 h-3 transition-opacity ${isDark ? 'text-white/40' : 'text-gray-400'} ${onboardingStep === 0 ? 'opacity-0 group-hover:opacity-100' : 'opacity-50'}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Main Content Area */}
      <div className="text-center max-w-4xl relative z-10 px-4 group cursor-default w-full">
        
        <AnimatePresence mode="wait">
            {/* Onboarding Step 1: Location */}
            {onboardingStep === 1 && (
                <motion.div
                    key="step-location"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }} 
                    transition={{ duration: 0.5 }}
                    className="w-full flex flex-col items-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-light mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        What is your location?
                    </h2>
                    <form onSubmit={handleLocationSubmit} className="w-full max-w-lg relative">
                        <input
                            type="text"
                            autoFocus
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className={`w-full bg-transparent text-center text-2xl md:text-4xl font-light border-b-2 focus:outline-none pb-2 ${
                                isDark 
                                    ? 'border-white/20 text-white placeholder-white/20 focus:border-white' 
                                    : 'border-gray-300 text-gray-800 placeholder-gray-300 focus:border-gray-800'
                            } transition-colors`}
                            placeholder="e.g. London"
                        />
                    </form>
                </motion.div>
            )}

            {/* Onboarding Step 2: Unit */}
            {onboardingStep === 2 && (
                <motion.div
                    key="step-unit"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <h2 className={`text-3xl md:text-5xl font-light mb-12 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Fahrenheit or Celsius?
                    </h2>
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => handleOnboardingUnit('F')}
                            className={`text-2xl px-8 py-4 rounded-2xl border ${
                                isDark 
                                ? 'border-white/20 text-white hover:bg-white/10' 
                                : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                            } transition-all`}
                        >
                            Fahrenheit
                        </button>
                        <button 
                             onClick={() => handleOnboardingUnit('C')}
                             className={`text-2xl px-8 py-4 rounded-2xl border ${
                                isDark 
                                ? 'border-white/20 text-white hover:bg-white/10' 
                                : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                            } transition-all`}
                        >
                            Celsius
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Standard Weather Display */}
            {onboardingStep === 0 && (
                <motion.div
                    key="weather-display"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                     {/* Main Description */}
                    <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className={`text-4xl md:text-6xl lg:text-7xl font-light leading-tight ${isDark ? 'text-white' : 'text-gray-800'} transition-opacity duration-300 delay-300 group-hover:!opacity-0 group-hover:delay-0`}
                    >
                    {weatherData?.description || "Loading forecast..."}
                    </motion.h1>

                    {/* Stats on hover */}
                    <div className={`absolute inset-0 flex items-center justify-center gap-8 md:gap-12 opacity-0 transition-opacity duration-300 delay-0 group-hover:opacity-100 group-hover:delay-300 pointer-events-none`}>
                    <div className={`text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        <p className="text-5xl md:text-7xl font-light">{Math.round(Number(weatherData?.high)) || '--'}°</p>
                        <p className={`text-xs uppercase tracking-widest mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>High</p>
                    </div>
                    <div className={`w-px h-16 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                    <div className={`text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        <p className="text-5xl md:text-7xl font-light">{Math.round(Number(weatherData?.low)) || '--'}°</p>
                        <p className={`text-xs uppercase tracking-widest mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Low</p>
                    </div>
                    <div className={`w-px h-16 ${isDark ? 'bg-white/20' : 'bg-gray-300'}`} />
                    <div className={`text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        <p className="text-5xl md:text-7xl font-light">{weatherData?.precipitation || 0}%</p>
                        <p className={`text-xs uppercase tracking-widest mt-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Rain</p>
                    </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}
