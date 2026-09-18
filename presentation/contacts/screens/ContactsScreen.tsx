import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { ActivityIndicator, SegmentedButtons, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useContacts } from '../hooks/useContacts';
import { useDevice } from '@/presentation/device/hooks/useDevice';
import { ContactRow } from '../components/ContactRow';
import { AddContactRow } from '../components/AddContactRow';
import { EmptyState } from '../components/EmptyState';
import { EmptyFilterState } from '../components/EmptyFilterState';
import { NoDeviceState } from '@/presentation/device/components/NoDeviceState';

export default function ContactsScreen() {
    const router = useRouter();
    const theme = useTheme();
    const [tab, setTab] = useState<'cercanos' | 'conocidos'>('cercanos');
    const { contacts: allContacts, cercanos, conocidos, isLoading, refresh } = useContacts();
    const { device, isLoading: isLoadingDevice, fetchDevice } = useDevice();

    // Se revalida al entrar al tab: el usuario puede vincular el timbre desde
    // la pantalla de Dispositivo y volver acá sin remontar la app.
    useFocusEffect(
        useCallback(() => {
            void fetchDevice();
        }, [fetchDevice]),
    );

    const list = tab === 'cercanos' ? cercanos : conocidos;

    // Carga inicial (todavía sin contactos ni datos del timbre): loader centrado
    // en vez de los estados vacíos, que son para cuando ya se sabe que no hay nada.
    if ((isLoading && allContacts.length === 0) || (isLoadingDevice && !device)) {
        return (
            <CenteredContainer>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </CenteredContainer>
        );
    }

    // Sin timbre vinculado no se pueden agregar contactos: el reconocimiento y
    // las fotos dependen del dispositivo.
    if (!device) {
        return (
            <Container>
                <NoDeviceState
                    title={'Vinculá tu timbre\npara agregar contactos'}
                    description="Los contactos usan las fotos y el reconocimiento de tu timbre. Vinculá un dispositivo para empezar a agregar personas."
                    onLink={() => router.push('/(app-name)/(tabs)/device/link-device')}
                />
            </Container>
        );
    }

    return (
        <Container>
            {allContacts.length === 0 ? (
                <EmptyState onAdd={() => router.push('/contacts/new')} />
            ) : (
                <>
                    {/* SegmentedButtons queda fijo arriba, NO adentro de ningún scroll.
                        Solo se muestra si ya hay al menos un contacto registrado. */}
                    <SegmentedButtons
                        value={tab}
                        onValueChange={(v) => setTab(v as 'cercanos' | 'conocidos')}
                        buttons={[
                            { value: 'cercanos', label: `Mis Contactos · ${cercanos.length}` },
                            { value: 'conocidos', label: `Conocidos · ${conocidos.length}` },
                        ]}
                        style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 12 }}
                    />

                    {list.length === 0 ? (
                        <EmptyFilterState tab={tab} onAdd={() => router.push('/contacts/new')} />
                    ) : (
                        // Único scroll de la pantalla. ListHeaderComponent reemplaza
                        // al ScrollView para el botón de agregar.
                        <FlatList
                            data={list}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                            ListHeaderComponent={
                                <AddContactRow onPress={() => router.push('/contacts/new')} />
                            }
                            onRefresh={refresh}
                            refreshing={isLoading}
                            renderItem={({ item }) => (
                                <ContactRow contact={item} onPress={() => router.push(`/contacts/${item.id}`)} />
                            )}
                        />
                    )}
                </>
            )}
        </Container>
    );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;
