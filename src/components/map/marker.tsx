"use client";

import { useState, useEffect, memo } from "react";

interface MarkerProps extends google.maps.MarkerOptions {
  onClick?: Function;
  onDragEnd?: Function;
}

const Marker: React.FC<MarkerProps> = ({ onClick, onDragEnd, ...options }) => {

  return null;
};

export default memo(Marker);
