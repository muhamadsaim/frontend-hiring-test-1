"use client";

const getToken = () => {
  if (typeof document === "undefined") {
    return null;
  }
  const getTokenFromCookies = () => {
    const name = "token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  };

  return getTokenFromCookies();
};

export default getToken;
