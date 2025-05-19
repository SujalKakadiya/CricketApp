export const lightTheme = {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      card: '#F2F2F7',
      text: '#000000',
      border: '#C7C7CC',
      notification: '#FF3B30',
      error: '#FF3B30',
      success: '#34C759',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      h1: {
        fontSize: 32,
        fontWeight: 'bold',
      },
      h2: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      body: {
        fontSize: 16,
      },
      caption: {
        fontSize: 14,
      },
    },
  };
  
  export const darkTheme = {
    ...lightTheme,
    colors: {
      ...lightTheme.colors,
      background: '#000000',
      card: '#1C1C1E',
      text: '#FFFFFF',
      border: '#38383A',
    },
  };
  