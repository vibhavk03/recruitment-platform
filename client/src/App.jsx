import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { lightThemeSettings, darkThemeSettings } from './theme';
import { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Register from './scenes/RegisterPage';
import Login from './scenes/LoginPage';
import ApplicantDashboard from './scenes/ApplicantDashboard';
import RecruiterDashboard from './scenes/RecruiterDashboard';
import AppliedJobs from './scenes/AppliedJobs';
import CreatedJobs from './scenes/CreatedJobs';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      /* here prev captures the latest state */
      const newMode = !prev;
      localStorage.setItem('isDarkMode', JSON.stringify(newMode)); // Save to localStorage
      return newMode;
    });
  };
  const theme = useMemo(
    () => createTheme(isDarkMode ? darkThemeSettings : lightThemeSettings),
    [isDarkMode]
  );

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%">
            <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/applicant-dashboard"
                element={<ApplicantDashboard />}
              />
              <Route path="/applied-jobs" element={<AppliedJobs />} />

              <Route
                path="/recruiter-dashboard"
                element={<RecruiterDashboard />}
              />
              <Route path="/created-jobs" element={<CreatedJobs />} />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
