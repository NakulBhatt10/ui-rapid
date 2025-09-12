import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme, lightTheme } from '../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
  variant?: 'default' | 'elevated' | 'outline';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  theme = lightTheme,
  variant = 'default',
}) => {
  const cardStyles = getCardStyles(theme, variant);

  return <View style={[cardStyles.container, style]}>{children}</View>;
};

export interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  style,
  theme = lightTheme,
}) => {
  return (
    <View
      style={[
        {
          padding: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
  theme = lightTheme,
}) => {
  return (
    <View
      style={[
        {
          padding: theme.spacing.lg,
          paddingTop: 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
  theme = lightTheme,
}) => {
  return (
    <View
      style={[
        {
          padding: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const getCardStyles = (theme: Theme, variant: string) => {
  const baseStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  };

  const variantStyles = {
    default: {
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    elevated: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    outline: {
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
  };

  return StyleSheet.create({
    container: {
      ...baseStyle,
      ...variantStyles[variant as keyof typeof variantStyles],
    },
  });
};