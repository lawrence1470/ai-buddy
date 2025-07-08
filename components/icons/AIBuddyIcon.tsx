import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface AIBuddyIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function AIBuddyIcon({ 
  size = 24, 
  color = '#7DA3E0',
  style 
}: AIBuddyIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={style}
    >
      {/* Head/Brain */}
      <Circle cx="12" cy="10" r="7" fill={color} opacity="0.2"/>
      <Circle cx="12" cy="10" r="7" stroke={color} strokeWidth="2"/>
      
      {/* AI Neural Network Pattern */}
      <Circle cx="9" cy="8" r="1.5" fill={color}/>
      <Circle cx="15" cy="8" r="1.5" fill={color}/>
      <Circle cx="12" cy="11" r="1.5" fill={color}/>
      
      {/* Connection lines */}
      <Path d="M9 8L12 11M15 8L12 11" stroke={color} strokeWidth="1" opacity="0.5"/>
      
      {/* Friendly smile */}
      <Path 
        d="M8 12C8 12 9.5 14 12 14C14.5 14 16 12 16 12" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      
      {/* Speech bubble with dots (representing AI communication) */}
      <Path 
        d="M19 5C19 3.89543 18.1046 3 17 3H15C13.8954 3 13 3.89543 13 5V6C13 7.10457 13.8954 8 15 8H15.5L16.5 9.5V8H17C18.1046 8 19 7.10457 19 6V5Z" 
        fill="#FFB4D2" 
        opacity="0.3"
      />
      <Path 
        d="M19 5C19 3.89543 18.1046 3 17 3H15C13.8954 3 13 3.89543 13 5V6C13 7.10457 13.8954 8 15 8H15.5L16.5 9.5V8H17C18.1046 8 19 7.10457 19 6V5Z" 
        stroke="#FFB4D2" 
        strokeWidth="1.5"
      />
      
      {/* Three dots in speech bubble */}
      <Circle cx="14.5" cy="5.5" r="0.5" fill="#FFB4D2"/>
      <Circle cx="16" cy="5.5" r="0.5" fill="#FFB4D2"/>
      <Circle cx="17.5" cy="5.5" r="0.5" fill="#FFB4D2"/>
      
      {/* Body suggestion (simple rounded shape) */}
      <Path 
        d="M12 17C14 17 16 18 16 20V22H8V20C8 18 10 17 12 17Z" 
        fill={color} 
        opacity="0.2"
      />
      <Path 
        d="M12 17C14 17 16 18 16 20V22H8V20C8 18 10 17 12 17Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}