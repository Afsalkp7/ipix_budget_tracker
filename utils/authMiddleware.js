export const parseJwt = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = atob(base64Url);
    return JSON.parse(base64);
  };
  
  export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
  
    try {
      const decoded = parseJwt(token);
      console.log('Decoded Token:', decoded);
  
      // Check if the token is expired
      const isExpired = Date.now() >= decoded.exp * 1000;
      return !isExpired;
    } catch (error) {
      console.error('Token parsing error:', error);
      return false;
    }
  };
  