import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface ChatBubbleIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export default function ChatBubbleIcon({ 
  size = 24, 
  color = '#7DA3E0',
  style 
}: ChatBubbleIconProps) {
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={style}
    >
      {/* Chat bubble background */}
      <Path 
        d="M4 4H20C20.5523 4 21 4.44772 21 5V15C21 15.5523 20.5523 16 20 16H13L8 20V16H4C3.44772 16 3 15.5523 3 15V5C3 4.44772 3.44772 4 4 4Z" 
        fill={color}
        opacity="0.2"
      />
      <Path 
        d="M4 4H20C20.5523 4 21 4.44772 21 5V15C21 15.5523 20.5523 16 20 16H13L8 20V16H4C3.44772 16 3 15.5523 3 15V5C3 4.44772 3.44772 4 4 4Z" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Typing dots */}
      <Path 
        d="M7 10H7.01M12 10H12.01M17 10H17.01" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}