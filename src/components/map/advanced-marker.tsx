"use client";

import {
  memo,
  type PropsWithChildren,
} from "react";

type AdvancedMarkerProps = {
  onClick?: Function;
  map?: google.maps.Map;
} & google.maps.marker.AdvancedMarkerElementOptions;

const AdvancedMarker: React.FC<PropsWithChildren<AdvancedMarkerProps>> = ({
  onClick,
  map,
  children,
  zIndex,
  ...options
}) => {
  return null;
};

export default memo(AdvancedMarker);
