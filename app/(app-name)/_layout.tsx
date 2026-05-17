import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../../presentation/auth/hooks/useAuth';

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const theme = useTheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={theme.colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}