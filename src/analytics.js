import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-MW54RRMWGW");
};

export const pageView = (path) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};