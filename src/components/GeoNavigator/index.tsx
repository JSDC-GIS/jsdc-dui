import React, { useEffect } from "react";

export enum Navigation {
  Walk,
  Car,
  MassTransit,
  Bike,
}

/**
 * [lat, lng]
 */
export interface IGeoNavigatorProps {
  origin: [number, number];
  destination: [number, number];
  type: Navigation;
}

const getNaviType = (type: Navigation) => {
  const NaviType = {
    [Navigation.Walk]: "!3m1!4b1!4m2!4m1!3e2",
    [Navigation.Car]: "!3m1!4b1!4m2!4m1!3e0",
    [Navigation.MassTransit]: "!3m1!4b1!4m2!4m1!3e3",
    [Navigation.Bike]: "!3m1!4b1!4m2!4m1!3e1",
  };
  return NaviType[type];
};

const GeoNavigator = ({ origin, destination, type }: IGeoNavigatorProps) => {
  useEffect(() => {
    const url = `https://www.google.com/maps/dir/${origin.join(",")}/${destination.join(",")}/data=${getNaviType(type)}`;
    window.open(url);
  }, [origin, destination, type]);
  return null;
};

export default GeoNavigator;
