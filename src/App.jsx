import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Recharts imports
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  Tooltip, BarChart, Bar, Cell 
} from 'recharts';

// --- Icon Definitions ---

// 1. Toggle Icons (New, Simple, Filled style)
const SunToggle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonToggle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

// 2. Weather & UI Icons
const Icons = {
  // Corrected Sun Icon with proper viewBox for the path
  Sun: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
       <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ),
  Moon: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-8,104.83,104.83,0,0,0-29.17,200.12A104.59,104.59,0,0,0,210,232a104.84,104.84,0,0,0,32.09-82.22A8,8,0,0,0,233.54,142.23Z" />
    </svg>
  ),
  MoonNew: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeWidth="16"/>
    </svg>
  ),
  MoonWaxingCrescent: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
       <path d="M224 128A96 96 0 1 1 54.2 66a8 8 0 0 1 2.2 13.8A63.8 63.8 0 0 0 48 104a80 80 0 1 0 102.6 76.7 64.2 64.2 0 0 0 39.5-8.5 8 8 0 0 1 11.2 2.3A95.7 95.7 0 0 1 224 128Z"/>
    </svg>
  ),
  MoonFirstQuarter: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M128,32V224A96,96,0,0,0,128,32Z" />
      <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeWidth="16"/>
    </svg>
  ),
  MoonWaxingGibbous: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M128 32a96 96 0 0 0 0 192 96 96 0 0 1 0-192Z"/>
      <path d="M224 128A96 96 0 0 1 65.1 199.1a8 8 0 0 1 1.2-11.2A64 64 0 1 0 66.3 68a8 8 0 0 1-1.2-11.1A96 96 0 0 1 224 128Z"/>
    </svg>
  ),
  MoonFull: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <circle cx="128" cy="128" r="96" />
    </svg>
  ),
  MoonWaningGibbous: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M128 32a96 96 0 0 1 0 192 96 96 0 0 0 0-192Z"/>
      <path d="M190.9 56.9a8 8 0 0 1-1.2 11.1A64 64 0 1 0 190 188a8 8 0 0 1-1.2 11.2A96 96 0 1 1 190.9 56.9Z"/>
    </svg>
  ),
  MoonLastQuarter: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M128,224V32A96,96,0,0,0,128,224Z" />
      <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeWidth="16"/>
    </svg>
  ),
  MoonWaningCrescent: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
       <path d="M128 32A96 96 0 1 0 224 128 96.1 96.1 0 0 0 128 32Zm0 176a80 80 0 1 1 80-80A80.1 80.1 0 0 1 128 208Z" opacity="0.2"/>
       <path d="M211.3 147.2a64.2 64.2 0 0 1-39.5-8.5A80 80 0 1 1 69.2 62a8 8 0 0 0-11.2-2.3A96 96 0 1 0 211.3 147.2Z"/>
    </svg>
  ),
  Cloud: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M160,224H72a80,80,0,1,1,12.78-158.93,104,104,0,0,1,135,116.86A56,56,0,0,1,160,224Z" />
    </svg>
  ),
  CloudRain: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M213.78,122.07A104,104,0,0,0,24.22,122.07,56,56,0,0,0,72,224h1.72a8,8,0,0,0,0-16H72a40,40,0,0,1-3.61-79.84,8,8,0,0,0-7.35-7.66,88,88,0,1,1,133.92,0,8,8,0,0,0-7.35,7.66A40,40,0,0,1,184,208h-2.19a8,8,0,0,0,0,16H184a56,56,0,0,0,29.78-101.93ZM93.44,233.53a8,8,0,0,1-10.89,3,8,8,0,0,1-2.92-10.92l24.47-49.46a8,8,0,0,1,13.81,6.88ZM146.47,192a8,8,0,0,1,13.81-6.88l24.47,49.46a8,8,0,1,1-14.33,7.09Zm-37-15.09a8,8,0,0,1,13.81-6.88l24.47,49.46a8,8,0,1,1-14.33,7.09Z" />
    </svg>
  ),
  CloudSnow: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M168,184H72A80,80,0,1,1,151,32.2a104.11,104.11,0,0,1,88,67.62,56,56,0,0,1,0,84.34A8,8,0,0,1,228,169.37a40,40,0,0,0-44-38.3A8,8,0,0,1,176,124a88,88,0,1,0-128.6,83,8,8,0,0,1-3.56,15.22,103.18,103.18,0,0,1-23.75-5.32,80,80,0,0,1,51.86-152.8,103.4,103.4,0,0,1,108.6-32A56.06,56.06,0,0,1,168,184Zm-69.66,26.34a8,8,0,0,0-11.32,11.32l12,12a8,8,0,0,0,11.32-11.32Zm66.32,11.32a8,8,0,0,0-11.32-11.32l-12,12a8,8,0,0,0,11.32-11.32ZM128,192a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V200A8,8,0,0,0,128,192Z" />
    </svg>
  ),
  Wind: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M184,120h-8a8,8,0,0,1,0-16h8a32,32,0,0,0,0-64H160a32,32,0,0,0-32,32,8,8,0,0,1-16,0,48.05,48.05,0,0,1,48-48h24a48,48,0,0,1,0,96Zm-56,16H24a8,8,0,0,0,0,16h104a32,32,0,0,0,0-64H104a8,8,0,0,0,0,16h24a16,16,0,0,1,0,32Zm80-16a48,48,0,0,0-48,48,8,8,0,0,0,16,0,32,32,0,0,1,64,0,32.09,32.09,0,0,1-32,32H168a8,8,0,0,0,0,16h40a48,48,0,0,0,0-96Z" />
    </svg>
  ),
  CloudLightning: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M102,233.8a8,8,0,0,1-1.83-8.89l12.44-32.91H96a8,8,0,0,1-7.07-12.06l24-42A88,88,0,1,1,223.47,94.22,56,56,0,0,1,168,176H152a8,8,0,0,1,0-16h16a40,40,0,0,0,5.88-79.57,8,8,0,0,1,6.86-7.85A72,72,0,1,0,72,160h6.14a8,8,0,0,1,7.24,5.2l.53,1.4,19.26,51.05A8,8,0,0,1,102,233.8Z" />
    </svg>
  ),
  Search: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM112,184a72,72,0,1,1,72-72A72.08,72.08,0,0,1,112,184Z" />
    </svg>
  ),
  MapPin: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z" />
    </svg>
  ),
  X: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  ),
  Loader2: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" opacity="0.2"/>
      <path d="M128,24V40a8,8,0,0,1,0,16,72,72,0,0,0,72,72h16a8,8,0,0,1,0,16h-16a88.1,88.1,0,0,1-88-88V24a8,8,0,0,1,16,0Z" />
    </svg>
  ),
  Droplets: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M221.43,153.58C214.28,132.89,178.69,73.5,178.69,73.5a8,8,0,0,0-13.38,0s-35.59,59.39-42.74,80.08a40,40,0,1,0,75.48-26.17A38.27,38.27,0,0,1,208,160a40,40,0,0,0,13.43-6.42ZM90.69,121.5a8,8,0,0,0-13.38,0S41.72,180.89,34.57,201.58A40,40,0,0,0,104,228a38.27,38.27,0,0,1,9.85-32.59A40,40,0,0,0,133.43,184C126.28,163.31,90.69,104,90.69,121.5Z" />
    </svg>
  ),
  Eye: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C219.05,150.28,178.69,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
    </svg>
  ),
  Thermometer: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M228,80a44.05,44.05,0,0,0-44,44,8,8,0,0,1-16,0,60,60,0,0,1,60-60,8,8,0,0,1,0,16Zm-68,44a4,4,0,0,1-4,4H144a4,4,0,0,0-4,4v20.08a4,4,0,0,1-4,4,28,28,0,1,0,48,0,4,4,0,0,1-4-4V128A4,4,0,0,1,160,124Zm-16-92a40,40,0,0,0-40,40v82.75a60,60,0,1,0,80,0V72A40,40,0,0,0,144,32Zm20,154.25A44,44,0,1,1,124,152V72a20,20,0,0,1,40,0Z" />
    </svg>
  ),
  Gauge: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M211.59,200.41,173.33,143A56,56,0,1,0,128,184h83.59A8,8,0,0,0,211.59,200.41ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168ZM232,128A104,104,0,1,1,128,24a8,8,0,0,1,0,16A88,88,0,1,0,216,128a8,8,0,0,1,16,0Z" />
    </svg>
  ),
  Sunrise: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M240,192H16a8,8,0,0,1,0-16H42.6a96.1,96.1,0,0,1,170.8,0H240a8,8,0,0,1,0,16ZM79.67,117.81a8,8,0,0,0,11.31-11.31l-24-24a8,8,0,0,0-11.31,11.31Zm96.66,0,24-24a8,8,0,0,0-11.31-11.31l-24,24a8,8,0,0,0,11.31,11.31ZM128,88a8,8,0,0,0,8-8V48a8,8,0,0,0-16,0V80A8,8,0,0,0,128,88Z" />
    </svg>
  ),
  Sunset: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M240,192H16a8,8,0,0,1,0-16H42.6a96.1,96.1,0,0,1,170.8,0H240a8,8,0,0,1,0,16ZM79.67,54.19,55.66,30.18a8,8,0,0,0-11.32,11.32l24,24a8,8,0,0,0,11.31-11.31Zm120.67,0a8,8,0,0,0,11.31,11.31l24-24a8,8,0,0,0-11.31-11.31ZM128,64a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,128,64Z" />
    </svg>
  ),
  ChevronDown: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  ),
  RefreshCw: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" {...props}>
      <path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,88.25V56a8,8,0,0,1,16,0Z" />
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
    // Simple moon phase calculation
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let c = 0, e = 0, jd = 0, b = 0;

    if (month < 3) {
      year--;
      month += 12;
    }

    ++month;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);

    if (b >= 8) b = 0;

    // 0 => New Moon
    // 1 => Waxing Crescent
    // 2 => First Quarter
    // 3 => Waxing Gibbous
    // 4 => Full Moon
    // 5 => Waning Gibbous
    // 6 => Last Quarter
    // 7 => Waning Crescent
    
    switch(b) {
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

// --- Main Components ---

function ThemeToggle({ isDark, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
        isDark 
          ? 'bg-white/10 hover:bg-white/15' 
          : 'bg-gray-900/5 hover:bg-gray-900/10'
      } transition-colors backdrop-blur-sm`}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isDark ? (
          <SunToggle className="w-5 h-5 text-white/70" />
        ) : (
          <MoonToggle className="w-5 h-5 text-gray-600" />
        )}
      </motion.div>
    </motion.button>
  );
}

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

function WeatherDetails({ weatherData, isDark, unit, onRefresh, isRefreshing }) {
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
        </motion.div>
      </div>
    </div>
  );
}

function LocationSelector({ isOpen, onClose, onSelectLocation, currentLocation, isDark }) {
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
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-4 ${
              isDark ? 'bg-slate-900' : 'bg-white'
            } rounded-2xl shadow-2xl overflow-hidden`}
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
            <div className="max-h-[300px] overflow-y-auto">
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

// --- REAL API DATA FETCHING ---

const fetchWeatherData = async (lat, lon, locationName, unit = 'F') => {
  try {
    const isC = unit === 'C';
    const tempUnit = isC ? 'celsius' : 'fahrenheit';
    const precipUnit = 'inch'; 
    const windUnit = 'mph';

    // Added &minutely_15=precipitation
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&minutely_15=precipitation&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precipUnit}&timezone=auto&forecast_days=7&past_days=1`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();

    const current = data.current;
    const daily = data.daily;
    const hourly = data.hourly;
    const minutely = data.minutely_15;
    
    // Index 0 = Yesterday, Index 1 = Today
    const wmoCode = current.weather_code;
    const condition = getWeatherCondition(wmoCode);
    const precipType = (condition === 'snowy' || current.temperature_2m < 32) ? 'Snow' : 'Rain';
    
    // Determine Index of current hour in the full hourly array
    const currentIsoTime = current.time; 
    let currentHourIndex = hourly.time.findIndex(t => t === currentIsoTime);
    if (currentHourIndex === -1) {
        // Fallback matching
        const currentHourStr = currentIsoTime.slice(0, 13);
        currentHourIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr));
    }
    if (currentHourIndex === -1) currentHourIndex = 24; // Fallback to index 24 (start of today) if lost

    // Qualitative Description Logic
    let description = "";
    
    // For Preview: Manually force night mode
    // current.is_day = 0; // SPOOFING NIGHT TIME FOR PREVIEW

    if (current.is_day === 0) {
        // NIGHT LOGIC
        // Compare current temp vs 24 hours ago
        const tempNow = current.temperature_2m;
        // Ensure index is valid for 24h ago check
        const compareIndex = currentHourIndex >= 24 ? currentHourIndex - 24 : 0;
        const tempLastNight = hourly.temperature_2m[compareIndex]; 
        
        let diff = tempNow - tempLastNight;
        let nightTempDesc = "about the same as";
        if (diff > 2) nightTempDesc = "warmer than";
        else if (diff < -2) nightTempDesc = "cooler than";
        
        let nightConditionDesc = "and clear.";
        if (condition === 'rainy') nightConditionDesc = "with rain expected.";
        else if (condition === 'snowy') nightConditionDesc = "with snow expected.";
        else if (condition === 'stormy') nightConditionDesc = "with storms likely.";
        else if (condition === 'cloudy') nightConditionDesc = "but cloudier.";
        
        description = `Tonight is ${nightTempDesc} last night, ${nightConditionDesc}`;
    } else {
        // DAY LOGIC
        const yesterdayMax = daily.temperature_2m_max[0];
        const todayMax = daily.temperature_2m_max[1];
        
        let tempDesc = "about the same temperature as";
        if (todayMax > yesterdayMax + 2) tempDesc = "warmer than";
        else if (todayMax < yesterdayMax - 2) tempDesc = "cooler than";
        
        let conditionDesc = "and clear skies.";
        if (condition === 'cloudy') conditionDesc = "but cloudier.";
        else if (condition === 'sunny') conditionDesc = "and sunny.";
        
        description = `Today will be ${tempDesc} yesterday. ${conditionDesc}`;
    }

    // --- PRECIPITATION ANALYSIS ---
    let precipSentence = "";
    
    // Safe access to precipitation array with fallback
    const minutelyPrecip = minutely?.precipitation || [];
    
    // 1. Check Immediate Rain (Next 60 mins -> first 4 slots)
    let startIdx = -1;
    // Ensure we don't go out of bounds
    const scanLimit = Math.min(4, minutelyPrecip.length);
    for (let i = 0; i < scanLimit; i++) {
        if (minutelyPrecip[i] > 0) {
            startIdx = i;
            break;
        }
    }

    if (startIdx !== -1) {
        const minutesUntil = startIdx * 15;
        const timeText = minutesUntil === 0 ? "starting now" : `starting in ${minutesUntil} minutes`;
        
        let endIdx = -1;
        for (let i = startIdx + 1; i < minutelyPrecip.length; i++) {
            if (minutelyPrecip[i] === 0) {
                endIdx = i;
                break;
            }
        }
        
        const durationSlots = endIdx === -1 ? 99 : (endIdx - startIdx);
        if (durationSlots <= 4) {
            precipSentence = `${precipType} likely ${timeText}, stopping shortly after.`;
        } else {
            precipSentence = `${precipType} likely ${timeText}, continuing for a while.`;
        }
    } else {
        // 2. Check Later Rain
        let hourlyStartIdx = hourly.time.findIndex(t => t.startsWith(currentIsoTime.slice(0, 13)));
        if (hourlyStartIdx === -1) hourlyStartIdx = 0;

        let rainStartHour = -1;
        // Scan next 18 hours
        for (let i = 0; i < 18; i++) {
            const idx = hourlyStartIdx + i;
            // Safety check for hourly data bounds
            if (hourly.precipitation_probability && hourly.precipitation_probability[idx] > 40) {
                rainStartHour = i;
                break;
            }
        }

        if (rainStartHour !== -1) {
            const date = new Date(hourly.time[hourlyStartIdx + rainStartHour]);
            const startHourStr = date.getHours() + ":00";
            
            let rainDuration = 0;
            let isSpotted = false;
            let gapFound = false;
            
            for (let i = 1; i < 12; i++) {
                const idx = hourlyStartIdx + rainStartHour + i;
                if (hourly.precipitation_probability && hourly.precipitation_probability[idx] > 40) {
                    if (gapFound) isSpotted = true;
                    rainDuration++;
                } else {
                    gapFound = true;
                }
            }

            if (isSpotted) {
                precipSentence = `Spotted ${precipType.toLowerCase()} showers likely today.`;
            } else if (rainDuration > 5) {
                const timeOfDay = date.getHours() >= 18 ? "all night" : "for the rest of the day";
                precipSentence = `${precipType} likely starting around ${startHourStr}, continuing ${timeOfDay}.`;
            } else {
                precipSentence = `${precipType} likely starting around ${startHourStr}.`;
            }
        }
    }

    // Append precipitation info if it exists
    if (precipSentence) {
        // If night logic already set description, append to it. 
        // If day logic set it, append to it.
        // We replace the last part if it was just generic condition desc.
        description += ` ${precipSentence}`;
    }

    // --- PROCESS HOURLY ---
    const next24Hours = [];
    const hourlyChartData = [];
    const precipChartData = [];

    // Find index of current hour
    let startIdxHourly = hourly.time.findIndex(t => t.startsWith(currentIsoTime.slice(0, 13)));
    if (startIdxHourly === -1) startIdxHourly = 24; 

    for (let i = 0; i < 24; i++) {
        const idx = startIdxHourly + i;
        if (!hourly.time[idx]) break;

        const date = new Date(hourly.time[idx]);
        const hour = date.getHours();
        const formatHour = (h) => {
            if (h === 0) return '12am';
            if (h === 12) return '12pm';
            return h > 12 ? `${h-12}pm` : `${h}am`;
        };
        const timeStr = formatHour(hour);

        const temp = hourly.temperature_2m[idx];
        const precipProb = hourly.precipitation_probability[idx];
        const code = hourly.weather_code[idx];
        
        const hourObj = {
            time: timeStr,
            temp: temp,
            condition: getWeatherCondition(code),
            precipitation: precipProb,
            isNow: i === 0
        };
        
        next24Hours.push(hourObj);

        if (i % 3 === 0) {
            hourlyChartData.push({ time: timeStr, temp: temp });
            precipChartData.push({ time: timeStr, precipitation: precipProb });
        }
    }

    // --- PROCESS DAILY ---
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const processedDaily = [];
    for (let i = 1; i < 8; i++) {
        if (!daily.time[i]) break;
        const date = new Date(daily.time[i]);
        processedDaily.push({
            day: days[date.getDay()],
            high: daily.temperature_2m_max[i],
            low: daily.temperature_2m_min[i],
            condition: getWeatherCondition(daily.weather_code[i]),
            precipitation: daily.precipitation_probability_max[i],
            isToday: i === 1
        });
    }

    return {
        location: locationName,
        currentTemp: current.temperature_2m,
        condition: condition,
        description: description,
        high: daily.temperature_2m_max[1],
        low: daily.temperature_2m_min[1],
        precipitation: daily.precipitation_probability_max[1],
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windGust: current.wind_gusts_10m,
        visibility: hourly.visibility ? hourly.visibility[startIdxHourly] / 1609 : 10,
        feelsLike: current.apparent_temperature,
        pressure: current.surface_pressure,
        uvIndex: daily.uv_index_max[1],
        sunrise: new Date(daily.sunrise[1]).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}),
        sunset: new Date(daily.sunset[1]).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}),
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hourly: next24Hours,
        temperatureChart: hourlyChartData,
        precipitationChart: precipChartData,
        daily: processedDaily,
        dewPoint: current.temperature_2m - ((100 - current.relative_humidity_2m)/5),
        isDay: current.is_day
    };
  } catch (error) {
    console.error("Fetch weather error", error);
    return null; 
  }
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [tempUnit, setTempUnit] = useState('F');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const detailsRef = useRef(null);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    
    const savedLocationName = localStorage.getItem('weather_app_location_name');
    const savedLat = localStorage.getItem('weather_app_lat');
    const savedLon = localStorage.getItem('weather_app_lon');
    const savedUnit = localStorage.getItem('weather_app_unit');

    if (savedLocationName && savedLat && savedLon && savedUnit) {
        const loc = { 
            name: savedLocationName, 
            lat: parseFloat(savedLat), 
            lon: parseFloat(savedLon) 
        };
        setLocation(loc);
        setTempUnit(savedUnit);
        setOnboardingStep(0);
        loadWeather(loc, savedUnit);
    } else {
        setOnboardingStep(1);
    }
  }, []);

  // Scroll to top when onboarding completes
  useEffect(() => {
    if (onboardingStep === 0) {
      window.scrollTo(0, 0);
    }
  }, [onboardingStep]);

  const loadWeather = async (loc, unit) => {
      const data = await fetchWeatherData(loc.lat, loc.lon, loc.name, unit);
      if (data) setWeatherData(data);
  };

  const handleRefresh = async () => {
    if (!location) return;
    setIsRefreshing(true);
    await loadWeather(location, tempUnit);
    setTimeout(() => setIsRefreshing(false), 500); 
  };

  const handleOnboardingLocation = async (locName) => {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locName)}&count=1&language=en&format=json`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const r = data.results[0];
            const newLocation = { 
                name: r.name, 
                country: r.country, 
                lat: r.latitude, 
                lon: r.longitude 
            };
            setLocation(newLocation);
            setOnboardingStep(2);
        } else {
            alert("Could not find location. Please try another city.");
        }
    } catch (e) {
        alert("Error searching location.");
    }
  };

  const handleOnboardingUnit = async (unit) => {
    setTempUnit(unit);
    
    if (location) {
        localStorage.setItem('weather_app_location_name', location.name);
        localStorage.setItem('weather_app_lat', location.lat);
        localStorage.setItem('weather_app_lon', location.lon);
        localStorage.setItem('weather_app_unit', unit);

        const data = await fetchWeatherData(location.lat, location.lon, location.name, unit);
        if (data) setWeatherData(data);
    }
    
    setOnboardingStep(0);
  };

  const handleLocationSelect = async (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('weather_app_location_name', newLocation.name);
    localStorage.setItem('weather_app_lat', newLocation.lat);
    localStorage.setItem('weather_app_lon', newLocation.lon);
    
    if (onboardingStep === 1) {
        setOnboardingStep(2);
        return; 
    }

    setWeatherData(null);
    const data = await fetchWeatherData(newLocation.lat, newLocation.lon, newLocation.name, tempUnit);
    if (data) setWeatherData(data);
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (onboardingStep === 0 && !weatherData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <Icons.Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white/30' : 'text-gray-300'}`} />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap');
          
          body, h1, h2, h3, h4, h5, h6, p, span, div, button, input {
            font-family: 'Clash Display', sans-serif;
            font-weight: 360;
          }
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}
      </style>
      <div className={`${isDark ? 'dark' : ''} transition-colors duration-500`}>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        
        <LocationSelector
            isOpen={isLocationOpen}
            onClose={() => setIsLocationOpen(false)}
            onSelectLocation={handleLocationSelect}
            currentLocation={location?.name}
            isDark={isDark}
        />
        
        <div className="relative">
          <WeatherHero 
            weatherData={weatherData} 
            location={location}
            isDark={isDark} 
            onLocationClick={() => setIsLocationOpen(true)}
            onboardingStep={onboardingStep}
            handleOnboardingLocation={handleOnboardingLocation}
            handleOnboardingUnit={handleOnboardingUnit}
          />
          {onboardingStep === 0 && (
            <ScrollIndicator isDark={isDark} onClick={scrollToDetails} />
          )}
        </div>
        
        {onboardingStep === 0 && (
            <div ref={detailsRef}>
            <WeatherDetails 
                weatherData={weatherData} 
                isDark={isDark} 
                unit={tempUnit} 
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
            </div>
        )}
      </div>
    </>
  );
}
