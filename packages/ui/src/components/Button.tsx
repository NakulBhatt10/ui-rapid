import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Theme, lightTheme } from '../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme?: Theme;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  theme = lightTheme,
}) => {
  const buttonStyles = getButtonStyles(theme, variant, size, disabled);

  return (
    <TouchableOpacity
      style={[buttonStyles.container, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={buttonStyles.text.color}
          size="small"
          style={{ marginRight: theme.spacing.sm }}
        />
      ) : null}
      <Text style={[buttonStyles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const getButtonStyles = (
  theme: Theme,
  variant: string,
  size: string,
  disabled: boolean
) => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  };

  const sizeStyles = {
    sm: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 32,
    },
    md: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.lg,
      minHeight: 52,
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? theme.colors.muted : theme.colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: disabled ? theme.colors.muted : theme.colors.secondary,
      borderWidth: 0,
    },
    destructive: {
      backgroundColor: disabled ? theme.colors.muted : theme.colors.destructive,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.muted : theme.colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  const textStyles = {
    primary: {
      color: disabled ? theme.colors.mutedForeground : theme.colors.primaryForeground,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    secondary: {
      color: disabled ? theme.colors.mutedForeground : theme.colors.secondaryForeground,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    destructive: {
      color: disabled ? theme.colors.mutedForeground : theme.colors.destructiveForeground,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    outline: {
      color: disabled ? theme.colors.mutedForeground : theme.colors.foreground,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    ghost: {
      color: disabled ? theme.colors.mutedForeground : theme.colors.foreground,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
  };

  return StyleSheet.create({
    container: {
      ...baseStyle,
      ...sizeStyles[size as keyof typeof sizeStyles],
      ...variantStyles[variant as keyof typeof variantStyles],
    },
    text: textStyles[variant as keyof typeof textStyles],
  });
};