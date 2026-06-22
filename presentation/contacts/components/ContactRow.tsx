import React from 'react';
import { Avatar, IconButton, Text } from 'react-native-paper';
import styled from 'styled-components/native';
import { Contact } from '../types';

const AVATAR_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getAvatarColor(id: string) {
    const idx = parseInt(id, 10) % AVATAR_COLORS.length;
    return AVATAR_COLORS[Number.isNaN(idx) ? 0 : idx];
}

type ContactRowProps = {
    contact: Contact;
    onPress: () => void;
};

export function ContactRow({ contact, onPress }: ContactRowProps) {
    const initials = getInitials(contact.name);

    return (
        <RowCard onPress={onPress}>
            <Avatar.Text size={48} label={initials} style={{ backgroundColor: getAvatarColor(contact.id) }} />
            <RowContent>
                <Text variant="titleMedium" style={{ fontWeight: '600' }}>
                    {contact.name}
                </Text>
                <Text variant="bodyMedium" style={{ color: '#6b7280' }}>
                    {contact.relation}
                </Text>
            </RowContent>
            <IconButton icon="chevron-right" size={20} />
        </RowCard>
    );
}

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
