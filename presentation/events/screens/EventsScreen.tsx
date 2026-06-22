import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import styled from 'styled-components/native';
import { useEvents } from '../hooks/useEvents';
import { FeaturedCard } from '../components/FeaturedCard';
import { EventRow } from '../components/EventRow';
import { EmptyEventsState } from '../components/EmptyEventsState';
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
                <Text style={{ color: theme.colors.primary }} onPress={refresh}>
                    Reintentar
                </Text>
            </CenteredView>
        );
    }

    if (events.length === 0) {
        return (
            <Container bg={theme.colors.background}>
                <EmptyEventsState />
            </Container>
        );
    }

    return (
        <Container bg={theme.colors.background}>
            {/* Evento destacado: fuera de cualquier scroll, siempre visible */}
            {featured && <FeaturedCard event={featured} onPress={handlePress} />}

            {/* Único scroll de la pantalla: historial como lista plana,
                sin agrupar por fecha. */}
            {rest.length > 0 && (
                <>
                    <SectionLabel color={theme.colors.onSurfaceVariant}>Historial</SectionLabel>
                    <FlatList
                        style={{ flex: 1 }}
                        data={rest}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                        renderItem={({ item }) => <EventRow event={item} onPress={handlePress} />}
                    />
                </>
            )}
        </Container>
    );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.View<{ bg: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg};
  padding: 16px 16px 0 16px;
`;

const CenteredView = styled.View<{ bg: string }>`
  flex: 1;
  background-color: ${({ bg }) => bg};
  justify-content: center;
  align-items: center;
`;

const SectionLabel = styled.Text<{ color: string }>`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: ${({ color }) => color};
  margin-bottom: 10px;
`;
