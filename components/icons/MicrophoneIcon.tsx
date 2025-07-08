import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface MicrophoneIconProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  isRecording?: boolean;
}

export default function MicrophoneIcon({ 
  size = 24, 
  color = '#7DA3E0',
  style,
  isRecording = false
}: MicrophoneIconProps) {
  const activeColor = isRecording ? '#FF5252' : color;
  
  return (
    <Svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={style}
    >
      {/* Microphone body */}
      <Rect 
        x="9" 
        y="3" 
        width="6" 
        height="11" 
        rx="3" 
        fill={activeColor}
        opacity={isRecording ? "0.3" : "0.2"}
      />
      <Rect 
        x="9" 
        y="3" 
        width="6" 
        height="11" 
        rx="3" 
        stroke={activeColor}
        strokeWidth="2"
      />
      
      {/* Stand */}
      <Path 
        d="M12 18V21M12 21H8M12 21H16" 
        stroke={activeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Sound waves */}
      <Path 
        d="M5 10V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V10" 
        stroke={activeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Recording indicator dot */}
      {isRecording && (
        <circle cx="12" cy="8" r="2" fill={activeColor} />
      )}
    </Svg>
  );
}