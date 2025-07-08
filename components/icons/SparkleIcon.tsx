import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface SparkleIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function SparkleIcon({ 
  size = 24, 
  color = '#FFB4D2',
  style 
}: SparkleIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={style}
    >
      {/* Large sparkle */}
      <Path 
        d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z" 
        fill={color}
        opacity="0.3"
      />
      <Path 
        d="M12 2L13.5 9L20 10.5L13.5 12L12 19L10.5 12L4 10.5L10.5 9L12 2Z" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Small sparkle 1 */}
      <Path 
        d="M20 2L20.5 3.5L22 4L20.5 4.5L20 6L19.5 4.5L18 4L19.5 3.5L20 2Z" 
        fill={color}
      />
      
      {/* Small sparkle 2 */}
      <Path 
        d="M20 18L20.5 19.5L22 20L20.5 20.5L20 22L19.5 20.5L18 20L19.5 19.5L20 18Z" 
        fill={color}
      />
      
      {/* Small sparkle 3 */}
      <Path 
        d="M3 14L3.5 15.5L5 16L3.5 16.5L3 18L2.5 16.5L1 16L2.5 15.5L3 14Z" 
        fill={color}
      />
    </Svg>
  );
}