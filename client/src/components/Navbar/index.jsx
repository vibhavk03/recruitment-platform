import {
  Box,
  Typography,
  useTheme,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PropTypes from 'prop-types';
import { useState } from 'react';
import StyledNavLink from '../StyledNavLink';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../state/authSlice';
import { useLogoutRecruiterMutation } from '../../state/recruitersApi';
import { useLogoutApplicantMutation } from '../../state/applicantsApi';

function Navbar({ isDarkMode, toggleDarkMode }) {
  const { palette } = useTheme();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev);
  };
  const role = useSelector((state) => state?.auth?.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApplicant] = useLogoutApplicantMutation();
  const [logoutRecruiter] = useLogoutRecruiterMutation();

  const handleLogout = async () => {
    try {
      if (role === 'applicant') {
        await logoutApplicant().unwrap();
      } else if (role === 'recruiter') {
        await logoutRecruiter().unwrap();
      }
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed' /* make navbar sticky */,
        width: '100%',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isSmallScreen ? '10px' : '10px 20px',
        backgroundColor: palette.background.contrast,
      }}
    >
      {/* left side navbar*/}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' }, // Hide menu links on small screens
          alignItems: 'center',
        }}
      >
        <StyledNavLink
          sx={{ marginRight: isSmallScreen ? '0px' : '10px' }}
          to="/"
        >
          Home
        </StyledNavLink>
        {role && (
          <StyledNavLink
            sx={{ marginRight: isSmallScreen ? '0px' : '10px' }}
            to={role === 'applicant' ? '/applied-jobs' : '/created-jobs'}
          >
            {role === 'applicant' ? 'Applied Jobs' : 'Created Jobs'}
          </StyledNavLink>
        )}
      </Box>

      {/* hamburger menu for small screens */}
      <MenuIcon
        sx={{
          display: {
            xs: 'block' /* show only on small screens */,
            sm: 'none',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          },
        }}
        onClick={handleDrawerToggle}
        aria-label="Toggle Menu"
      />
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerToggle}>
        <List>
          <ListItem>
            <StyledNavLink
              sx={{ marginRight: isSmallScreen ? '0px' : '10px' }}
              to="/"
              onClick={handleDrawerToggle}
            >
              Home
            </StyledNavLink>
          </ListItem>
          {role && (
            <ListItem>
              <StyledNavLink
                sx={{ marginRight: isSmallScreen ? '0px' : '10px' }}
                to={role === 'applicant' ? '/applied-jobs' : '/created-jobs'}
              >
                {role === 'applicant' ? 'Applied Jobs' : 'Created Jobs'}
              </StyledNavLink>
            </ListItem>
          )}
          {role && (
            <ListItem>
              <StyledNavLink
                to="/"
                onClick={handleLogout}
                sx={{
                  marginRight: isSmallScreen ? '0px' : '10px',
                }}
              >
                Logout
              </StyledNavLink>
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* center navbar*/}
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '16px', sm: '20px' },
            fontWeight: 'bold',
          }}
        >
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            Dream Job Platform
          </Link>
        </Typography>
      </Box>

      {/* right side */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {role && !isSmallScreen && (
          <button
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '22px',
              width: '22px',
              margin: '0px 30px 0px 15px',
            }}
            onClick={handleLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        )}
        <button
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '22px',
            width: '22px',
          }}
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <LightModeIcon sx={{ fontSize: '22px' }} />
          ) : (
            <DarkModeIcon sx={{ fontSize: '22px' }} />
          )}
        </button>
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Navbar;
