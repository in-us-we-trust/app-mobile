import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }} />
            </PaperProvider>
        </SafeAreaProvider>
    );
}