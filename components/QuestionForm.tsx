import React from 'react';

const Logo: React.FC = () => {
  // This component is currently unused but was causing a fatal error by not returning a value.
  // Returning null makes it a valid, non-rendering component and fixes the application crash.
  return null;
};

export default Logo;
