import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Theme, lightTheme } from '../theme';

export interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
  scrollable?: boolean;
  safeArea?: boolean;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  style,
  theme = lightTheme,
  scrollable = false,
  safeArea = true,
  statusBarStyle = 'dark-content',
}) => {
  const layoutStyles = getLayoutStyles(theme);

  const content = scrollable ? (
    <ScrollView
      style={layoutStyles.scrollView}
      contentContainerStyle={layoutStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[layoutStyles.container, style]}>{children}</View>
  );

  if (safeArea) {
    return (
      <>
        <StatusBar
          backgroundColor={theme.colors.background}
          barStyle={statusBarStyle}
        />
        <SafeAreaView style={[layoutStyles.safeArea, style]}>
          {content}
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={statusBarStyle}
      />
      {content}
    </>
  );
};

export interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
  padding?: keyof Theme['spacing'];
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  theme = lightTheme,
  padding = 'md',
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          padding: theme.spacing[padding],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export interface StackProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
  spacing?: keyof Theme['spacing'];
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
}

export const Stack: React.FC<StackProps> = ({
  children,
  style,
  theme = lightTheme,
  spacing = 'md',
  direction = 'column',
  align = 'stretch',
  justify = 'flex-start',
}) => {
  const stackChildren = React.Children.toArray(children);
  const spacingValue = theme.spacing[spacing];

  return (
    <View
      style={[
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
    >
      {stackChildren.map((child, index) => (
        <View
          key={index}
          style={{
            marginBottom:
              direction === 'column' && index < stackChildren.length - 1
                ? spacingValue
                : 0,
            marginRight:
              direction === 'row' && index < stackChildren.length - 1
                ? spacingValue
                : 0,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

const getLayoutStyles = (theme: Theme) => {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
  });
};