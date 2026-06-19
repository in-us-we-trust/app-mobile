import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Text, Avatar, Chip, IconButton, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useContacts } from '../hooks/useContacts';
import { Contact, RecognitionStatus } from '../types';
// ---------- Config de UI ----------

const STATUS_CONFIG: Record<RecognitionStatus, { color: string; label: string }> = {
    active: { color: '#16a34a', label: 'Reconocimiento activo' },
    missing_photo: { color: '#d97706', label: 'Falta foto para la IA' },
    pending: { color: '#6b7280', label: 'Pendiente' },
};

const AVATAR_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(id: string) {
    const idx = parseInt(id, 10) % AVATAR_COLORS.length;
    return AVATAR_COLORS[Number.isNaN(idx) ? 0 : idx];
}

export default function ContactsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [tab, setTab] = useState<'cercanos' | 'conocidos'>('cercanos');
    const { contacts: allContacts, cercanos, conocidos, isLoading, refresh } = useContacts();

    const list = tab === 'cercanos' ? cercanos : conocidos;

    return (
        <Container>
            {/* SegmentedButtons queda fijo arriba, NO adentro de ningún scroll */}
            <SegmentedButtons
                value={tab}
                onValueChange={(v) => setTab(v as 'cercanos' | 'conocidos')}
                buttons={[
                    { value: 'cercanos', label: `Mis Contactos · ${cercanos.length}` },
                    { value: 'conocidos', label: `Conocidos · ${conocidos.length}` },
                ]}
                style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 12 }}
            />

            {allContacts.length === 0 ? (
                <EmptyState onAdd={() => router.push('/contacts/new')} />
            ) : list.length === 0 ? (
                <EmptyFilterState tab={tab} />
            ) : (
                // Único scroll de la pantalla. ListHeaderComponent reemplaza
                // al ScrollView para el botón de agregar.
                <FlatList
                    data={list}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                    ListHeaderComponent={
                        <AddButton
                            mode="outlined"
                            icon="plus"
                            onPress={() => router.push('/contacts/new')}
                        >
                            Agregar contacto
                        </AddButton>
                    }
                    onRefresh={refresh}
                    refreshing={isLoading}
                    renderItem={({ item }) => (
                        <ContactRow contact={item} onPress={() => router.push(`/contacts/${item.id}`)} />
                    )}
                />
            )}
        </Container>
    );
}

// ---------- Subcomponentes ----------

function ContactRow({ contact, onPress }: { contact: Contact; onPress: () => void }) {
    const initials = getInitials(contact.name);
    const status = STATUS_CONFIG[contact.recognitionStatus];

    return (
        <RowCard onPress={onPress}>
            <Avatar.Text size={48} label={initials} style={{ backgroundColor: getAvatarColor(contact.id) }} />
            <RowContent>
                <RowTop>
                    <Text variant="titleMedium" style={{ fontWeight: '600' }}>
                        {contact.name}
                    </Text>
                </RowTop>
                <Text variant="bodyMedium" style={{ color: '#6b7280' }}>
                    {contact.relation}
                </Text>
            </RowContent>
            <IconButton icon="chevron-right" size={20} />
        </RowCard>
    );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
    return (
        <EmptyContainer>
            <IconCircle>
                <IconButton icon="account-group-outline" size={48} iconColor="#6d28d9" />
            </IconCircle>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', textAlign: 'center', marginTop: 16 }}>
                Todavía no agregaste contactos
            </Text>
            <Text variant="bodyMedium" style={{ color: '#6b7280', textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }}>
                Agregá a las personas que querés que la IA reconozca en la puerta y definí a quién avisar si pasa algo.
            </Text>
            <Button mode="contained" icon="plus" style={{ marginTop: 24, borderRadius: 24 }} contentStyle={{ paddingVertical: 6 }} onPress={onAdd}>
                Agregar contacto
            </Button>
            <Button mode="text" icon="help-circle-outline" style={{ marginTop: 8 }}>
                ¿Cómo funciona el reconocimiento?
            </Button>
        </EmptyContainer>
    );
}

// Estado vacío cuando SÍ hay contactos registrados pero ninguno cae en el tab activo
// (ej: tab "A notificar" y todos son "conocidos" sin notificación)
function EmptyFilterState({ tab }: { tab: 'cercanos' | 'conocidos' }) {
    const message =
        tab === 'cercanos'
            ? 'Todavía no marcaste a nadie como contacto cercano.'
            : 'Todavía no agregaste conocidos.';

    return (
        <EmptyContainer>
            <Text variant="bodyMedium" style={{ color: '#6b7280', textAlign: 'center' }}>
                {message}
            </Text>
        </EmptyContainer>
    );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const AddButton = styled(Button)`
    margin-bottom: 16px;
  border-radius: 24px;
  border-style: dashed;
`;

const RowCard = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 14px;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #f0f0f0;
`;

const RowContent = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const RowTop = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const StatusRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  gap: 6px;
`;

const Dot = styled.View<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props) => props.color};
`;

const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const IconCircle = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 2px;
  border-style: dashed;
  border-color: #d1d5db;
  align-items: center;
  justify-content: center;
`;
