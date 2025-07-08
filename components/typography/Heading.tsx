import React from 'react';
import { Text, TextProps } from './Text';

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level = 1, ...props }: HeadingProps) {
  const variant = `h${level}` as TextProps['variant'];
  
  return <Text variant={variant} {...props} />;
}

// Convenience components for each heading level
export const H1 = (props: Omit<HeadingProps, 'level'>) => <Heading level={1} {...props} />;
export const H2 = (props: Omit<HeadingProps, 'level'>) => <Heading level={2} {...props} />;
export const H3 = (props: Omit<HeadingProps, 'level'>) => <Heading level={3} {...props} />;
export const H4 = (props: Omit<HeadingProps, 'level'>) => <Heading level={4} {...props} />;
export const H5 = (props: Omit<HeadingProps, 'level'>) => <Heading level={5} {...props} />;
export const H6 = (props: Omit<HeadingProps, 'level'>) => <Heading level={6} {...props} />;