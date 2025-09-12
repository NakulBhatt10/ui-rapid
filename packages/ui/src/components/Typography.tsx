import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Theme, lightTheme } from '../theme';

export interface TypographyProps {
  children: React.ReactNode;
  style?: TextStyle;
  theme?: Theme;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption';
  color?: keyof Theme['colors'];
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  style,
  theme = lightTheme,
  variant = 'body',
  color,
  align = 'left',
  numberOfLines,
}) => {
  const textStyles = getTypographyStyles(theme, variant, color, align);

  return (
    <Text
      style={[textStyles.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
};

// Convenience components
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h1" />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h2" />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h3" />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="body" />
);

export const SmallText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="bodySmall" />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="caption" />
);

const getTypographyStyles = (
  theme: Theme,
  variant: string,
  color?: keyof Theme['colors'],
  align?: string
) => {
  const variantStyle = theme.typography[variant as keyof Theme['typography']];
  
  return StyleSheet.create({
    text: {
      ...variantStyle,
      color: color ? theme.colors[color] : theme.colors.foreground,
      textAlign: align as any,
    },
  });
};