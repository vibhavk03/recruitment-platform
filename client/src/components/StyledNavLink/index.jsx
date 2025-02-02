import { styled } from '@mui/material';
import { NavLink } from 'react-router-dom';

const StyledNavLink = styled(NavLink)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  marginRight: '10px',
  '&.active': {
    fontWeight: 'bold',
    color: 'inherit',
  },
}));

export default StyledNavLink;
