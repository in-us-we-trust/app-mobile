import { ActivityIndicator, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { router, useFocusEffect } from 'expo-router';
import { useDevice } from '@/presentation/device/hooks/useDevice';
import { useCallback } from 'react';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const Inner = styled.View`
  flex: 1;
  align-items: center;
  padding: 32px 24px;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

// --- Ícono con badge ---
const IconWrapper = styled.View`
  position: relative;
  margin-bottom: 20px;
`;

const IconBox = styled.View<{ backgroundColor: string }>`
  width: 120px;
  height: 120px;
  border-radius: 24px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
`;

// --- Nombre y estado ---
const DeviceName = styled(Text)`
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;

const StatusChip = styled.View<{ backgroundColor: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 20px;
  padding: 4px 12px;
  gap: 6px;
  margin-bottom: 24px;
`;

const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #22c55e;
`;

// --- Cards de stats (2 columnas) ---
const StatsRow = styled.View`
  flex-direction: row;
  width: 100%;
  gap: 12px;
  margin-bottom: 12px;
`;

const StatCard = styled.View<{ backgroundColor: string; borderColor: string }>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  padding: 16px;
  gap: 4px;
`;

const StatLabel = styled(Text)`
  margin-top: 4px;
`;

const StatValue = styled(Text)`
  font-weight: bold;
`;

// --- Sección de info ---
const InfoCard = styled.View<{ backgroundColor: string; borderColor: string }>`
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  margin-bottom: 12px;
  overflow: hidden;
`;

const InfoRow = styled.View<{ borderColor: string }>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ borderColor }) => borderColor};
`;

const InfoRowLast = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
`;

// --- Botón configurar ---
const ConfigButton = styled.TouchableOpacity<{ backgroundColor: string; borderColor: string }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  padding: 16px;
  margin-bottom: 16px;
  gap: 12px;
`;

// --- Estado vacío ---
const IconContainer = styled.View<{ borderColor: string }>`
  width: 180px;
  height: 180px;
  border-radius: 16px;
  border-width: 2px;
  border-style: dashed;
  border-color: ${({ borderColor }) => borderColor};
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const IconInner = styled.View<{ backgroundColor: string }>`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
`;

const Title = styled(Text)`
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
`;

const Subtitle = styled(Text)`
  text-align: center;
  margin-bottom: 32px;
  line-height: 22px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 16px;
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const truncateId = (id: string) => {
    if (id.length <= 10) return id;
    return id.slice(0, 4) + '…' + id.slice(-6);
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function DeviceScreen() {
    const theme = useTheme();
    const { device, isLoading, fetchDevice } = useDevice();

    useFocusEffect(
        useCallback(() => {
            void fetchDevice();
        }, [fetchDevice]),
    );

    // Hardcoded por ahora hasta que el backend los devuelva
    const MOCK_WIFI_SIGNAL = 'Buena';
    const MOCK_BATTERY = '86%';
    const MOCK_LAST_SYNC = 'sincronizado hace 2 min';

    if (isLoading) {
        return (
            <CenteredContainer style={{ backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </CenteredContainer>
        );
    }

    if (device) {
        return (
            <ScrollContainer style={{ backgroundColor: theme.colors.background }}>
                <Inner>
                    {/* Ícono con badge de estado */}
                    <IconWrapper>
                        <IconBox backgroundColor={theme.colors.primaryContainer}>
                            <MaterialCommunityIcons
                                name="doorbell"
                                size={64}
                                color={theme.colors.primary}
                            />
                        </IconBox>
                        <View style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            backgroundColor: '#22c55e',
                            borderWidth: 3,
                            borderColor: 'white',
                        }} />
                    </IconWrapper>

                    {/* Nombre */}
                    <DeviceName variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
                        {device.name}
                    </DeviceName>

                    {/* Chip de estado */}
                    <StatusChip backgroundColor="#dcfce7">
                        <StatusDot />
                        <Text variant="labelMedium" style={{ color: '#15803d' }}>
                            En línea · {MOCK_LAST_SYNC}
                        </Text>
                    </StatusChip>

                    {/* Stats: WiFi y Batería */}
                    <StatsRow>
                        <StatCard
                            backgroundColor={theme.colors.surface}
                            borderColor={theme.colors.outlineVariant}
                        >
                            <MaterialCommunityIcons
                                name="wifi"
                                size={20}
                                color={theme.colors.onSurfaceVariant}
                            />
                            <StatLabel variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Señal Wi-Fi
                            </StatLabel>
                            <StatValue variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                                {MOCK_WIFI_SIGNAL}
                            </StatValue>
                        </StatCard>

                        <StatCard
                            backgroundColor={theme.colors.surface}
                            borderColor={theme.colors.outlineVariant}
                        >
                            <MaterialCommunityIcons
                                name="battery-high"
                                size={20}
                                color={theme.colors.onSurfaceVariant}
                            />
                            <StatLabel variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Batería
                            </StatLabel>
                            <StatValue variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                                {MOCK_BATTERY}
                            </StatValue>
                        </StatCard>
                    </StatsRow>

                    {/* Info: Identificador y fecha */}
                    <InfoCard
                        backgroundColor={theme.colors.surface}
                        borderColor={theme.colors.outlineVariant}
                    >
                        <InfoRow borderColor={theme.colors.outlineVariant}>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                Identificador
                            </Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                {truncateId(device.deviceId)}
                            </Text>
                        </InfoRow>
                        <InfoRowLast>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                                Vinculado
                            </Text>
                            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                                {new Date(device.createdAt).toLocaleDateString('es-AR')}
                            </Text>
                        </InfoRowLast>
                    </InfoCard>

                    {/* Configurar dispositivo */}
                    <ConfigButton
                        backgroundColor={theme.colors.surface}
                        borderColor={theme.colors.outlineVariant}
                        onPress={() => { /* TODO: navegar a configuración */ }}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name="cog-outline"
                            size={24}
                            color={theme.colors.primary}
                        />
                        <Text
                            variant="bodyLarge"
                            style={{ flex: 1, color: theme.colors.onSurface }}
                        >
                            Configurar dispositivo
                        </Text>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={theme.colors.onSurfaceVariant}
                        />
                    </ConfigButton>
                </Inner>
            </ScrollContainer>
        );
    }

    // Estado vacío
    return (
        <CenteredContainer style={{ backgroundColor: theme.colors.background }}>
            <IconContainer borderColor={theme.colors.outlineVariant}>
                <IconInner backgroundColor={theme.colors.surface}>
                    <MaterialCommunityIcons
                        name="doorbell"
                        size={80}
                        color={theme.colors.primary}
                    />
                </IconInner>
            </IconContainer>

            <Title variant="headlineSmall" style={{ color: theme.colors.onBackground }}>
                No hay dispositivos vinculados
            </Title>

            <Subtitle variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Para comenzar a proteger tu hogar, necesitás vincular tu primer timbre. Es rápido y sencillo.
            </Subtitle>

            <StyledButton
                mode="contained"
                icon="plus-circle"
                onPress={() => router.push('/(app-name)/(tabs)/device/link-device')}
            >
                Vincular Dispositivo
            </StyledButton>

            <Button
                mode="text"
                icon="help-circle-outline"
                onPress={() => { }}
                labelStyle={{ color: theme.colors.primary }}
            >
                ¿Necesitás ayuda con la instalación?
            </Button>
        </CenteredContainer>
    );
}
