import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, 
  Search, MapPin, X, Loader2, Droplets, Eye, Thermometer, 
  Gauge, Sunrise, Sunset, ChevronDown, Moon, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, 
  Tooltip, BarChart, Bar, Cell 
} from 'recharts';

// --- Shared Constants & Helpers ---

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  windy: Wind,
  stormy: CloudLightning,
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
          <Sun className="w-5 h-5 text-white/70" strokeWidth={1.5} />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
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
        <ChevronDown 
          className={`w-6 h-6 ${isDark ? 'text-white/30 hover:text-white/50' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
          strokeWidth={1.5}
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
          <Icon className={`w-5 h-5 ${isDark ? 'text-white/30' : 'text-gray-300'}`} strokeWidth={1.5} />
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
          const Icon = weatherIcons[hour.condition] || Sun;
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
                strokeWidth={1.5}
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
          const Icon = weatherIcons[day.condition] || Sun;
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
                strokeWidth={1.5}
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
            icon={Droplets}
            subtitle={`Dew point ${Math.round(Number(weatherData.dewPoint))}°`}
            isDark={isDark}
            delay={0}
          />
          <WeatherCard
            title="Wind"
            value={weatherData.windSpeed}
            unit="mph"
            icon={Wind}
            subtitle={`Gusts up to ${weatherData.windGust} mph`}
            isDark={isDark}
            delay={0.05}
          />
          <WeatherCard
            title="Visibility"
            value={weatherData.visibility ? Math.round(Number(weatherData.visibility)) : 10}
            unit="mi"
            icon={Eye}
            subtitle={weatherData.visibility > 5 ? "Clear conditions" : "Reduced visibility"}
            isDark={isDark}
            delay={0.1}
          />
          <WeatherCard
            title="Feels Like"
            value={Math.round(Number(weatherData.feelsLike))}
            unit="°"
            icon={Thermometer}
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
            icon={Gauge}
            subtitle="Stable"
            isDark={isDark}
            delay={0.2}
          />
          <WeatherCard
            title="UV Index"
            value={weatherData.uvIndex}
            icon={Sun}
            subtitle={weatherData.uvIndex <= 2 ? "Low" : weatherData.uvIndex <= 5 ? "Moderate" : "High"}
            isDark={isDark}
            delay={0.25}
          />
          <WeatherCard
            title="Sunrise"
            value={weatherData.sunrise}
            icon={Sunrise}
            isDark={isDark}
            delay={0.3}
          />
          <WeatherCard
            title="Sunset"
            value={weatherData.sunset}
            icon={Sunset}
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
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                <X className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-500'}`} />
              </button>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
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
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
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
                      <Loader2 className={`w-6 h-6 animate-spin mx-auto ${isDark ? 'text-white/20' : 'text-gray-300'}`} />
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
    
    // Qualitative Description Logic
    const yesterdayMax = daily.temperature_2m_max[0];
    const todayMax = daily.temperature_2m_max[1];
    
    let tempDesc = "about the same temperature as";
    if (todayMax > yesterdayMax + 2) tempDesc = "warmer than";
    else if (todayMax < yesterdayMax - 2) tempDesc = "cooler than";
    
    let conditionDesc = "and clear skies.";
    if (condition === 'cloudy') conditionDesc = "but cloudier.";
    else if (condition === 'sunny') conditionDesc = "and sunny.";

    // --- PRECIPITATION ANALYSIS ---
    let precipSentence = "";
    // Declare currentIsoTime early to avoid reference error
    const currentIsoTime = current.time.slice(0, 13);
    
    // Safe access to precipitation array with fallback
    const minutelyPrecip = minutely?.precipitation || [];
    
    // 1. Check Immediate Rain (Next 60 mins -> first 4 slots)
    // Find first slot with > 0 precipitation
    // Note: minutely_15 array usually starts from current hour or recent past. 
    // We assume index 0 is approx 'now' or past 15 min. Let's scan first 4 indices.
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
        // Rain is starting soon or now
        const minutesUntil = startIdx * 15;
        const timeText = minutesUntil === 0 ? "starting now" : `starting in ${minutesUntil} minutes`;
        
        // Find end
        let endIdx = -1;
        for (let i = startIdx + 1; i < minutelyPrecip.length; i++) {
            if (minutelyPrecip[i] === 0) {
                endIdx = i;
                break;
            }
        }
        
        const durationSlots = endIdx === -1 ? 99 : (endIdx - startIdx);
        // 4 slots = 1 hour. 
        if (durationSlots <= 4) {
            precipSentence = `${precipType} likely ${timeText}, stopping shortly after.`;
        } else {
            precipSentence = `${precipType} likely ${timeText}, continuing for a while.`;
        }
    } else {
        // 2. Check Later Rain (Next 24 Hours)
        // Scan hourly precip probability > 40%
        // We use current hour index logic from before
        let hourlyStartIdx = hourly.time.findIndex(t => t.startsWith(currentIsoTime));
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
            // Rain found later
            const date = new Date(hourly.time[hourlyStartIdx + rainStartHour]);
            const startHourStr = date.getHours() + ":00";
            
            // Check duration
            let rainDuration = 0;
            let isSpotted = false;
            let gapFound = false;
            
            // Scan from start of rain for next 12 hours
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

    if (precipSentence) {
        // Override simple condition desc if rain is the main story
        conditionDesc = `with ${precipType.toLowerCase()} expected.`;
    }

    const description = `Today will be ${tempDesc} yesterday. ${precipSentence || conditionDesc.replace('with', 'With').replace('and', 'And').replace('but', 'But')}`;

    // --- PROCESS HOURLY ---
    const next24Hours = [];
    const hourlyChartData = [];
    const precipChartData = [];

    // Find index of current hour
    let startIdxHourly = hourly.time.findIndex(t => t.startsWith(currentIsoTime));
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
        dewPoint: current.temperature_2m - ((100 - current.relative_humidity_2m)/5)
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
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-white/30' : 'text-gray-300'}`} />
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
