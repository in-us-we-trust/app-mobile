import React from 'react';
import { ScrollView, ActivityIndicator, View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import styled from 'styled-components/native';
import { useEvents } from '../hooks/useEvents';
import { FeaturedCard } from '../components/FeaturedCard';
import { EventRow } from '../components/EventRow';
import { HomeEvent } from '../types';

export default function EventsScreen() {
    const theme = useTheme();
    const { events, loading, error, refresh } = useEvents();

    const handlePress = (event: HomeEvent) => {
        console.log('Ver evento:', event.id);
        // router.push(`/events/${event.id}`)
    };

    const [featured, ...rest] = events;

    if (loading) {
        return (
            <CenteredView bg={theme.colors.background}>
                <ActivityIndicator color={theme.colors.primary} />
            </CenteredView>
        );
    }

    if (error) {
        return (
            <CenteredView bg={theme.colors.background}>
                <Text style={{ color: theme.colors.error, marginBottom: 12 }}>{error}</Text>
                <Text
                    style={{ color: theme.colors.primary }}
                    onPress={refresh}
                >
                    Reintentar
                </Text>
            </CenteredView>
        );
    }

    return (
        <Container bg={theme.colors.background}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
            >
                {featured && (
                    <>
                        <FeaturedCard event={featured} onPress={handlePress} />
                    </>
                )}

                {rest.length > 0 && (
                    <>
                        <SectionLabel color={theme.colors.onSurfaceVariant}>Historial</SectionLabel>
                        <ListCard bg={theme.colors.surface} borderColor={theme.colors.outlineVariant}>
                            {rest.map((event, index) => (
                                <EventRow
                                    key={event.id}
                                    event={event}
                                    onPress={handlePress}
                                    isLast={index === rest.length - 1}
                                />
                            ))}
                        </ListCard>
                    </>
                )}
            </ScrollView>
        </Container>
    );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.View<{ bg: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg};
  padding: 0 16px;
`;

const CenteredView = styled.View<{ bg: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg};
  justify-content: center;
  align-items: center;
`;

const ScreenHeader = styled.View`
  margin-top: 24px;
  margin-bottom: 20px;
`;

const HeaderTitle = styled.Text<{ color: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${({ color }) => color};
  letter-spacing: -0.5px;
`;

const HeaderSubtitle = styled.Text<{ color: string }>`
  font-size: 13px;
  color: ${({ color }) => color};
  margin-top: 4px;
`;

const SectionLabel = styled.Text<{ color: string }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ color }) => color};
  margin-bottom: 10px;
  margin-top: 4px;
`;

const ListCard = styled.View<{ bg: string; borderColor: string }>`
  background-color: ${({ bg }) => bg};
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  overflow: hidden;
`;
