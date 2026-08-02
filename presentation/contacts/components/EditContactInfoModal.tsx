import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Button, TextInput } from 'react-native-paper';
import { BottomSheetModal } from './BottomSheetModal';
import { Contact } from '../types';

export type ContactInfoFormData = {
    email: string;
    cellphone: string;
};

type EditContactInfoModalProps = {
    visible: boolean;
    contact: Contact;
    isSaving: boolean;
    onClose: () => void;
    onSave: (data: ContactInfoFormData) => void;
};

export function EditContactInfoModal({
    visible,
    contact,
    isSaving,
    onClose,
    onSave,
}: EditContactInfoModalProps) {
    const isAdding = !contact.email && !contact.cellphone;
    const [cellphone, setCellphone] = useState(contact.cellphone ?? '');
    const [email, setEmail] = useState(contact.email ?? '');

    useEffect(() => {
        if (visible) {
            setCellphone(contact.cellphone ?? '');
            setEmail(contact.email ?? '');
        }
    }, [visible, contact]);

    return (
        <BottomSheetModal
            visible={visible}
            onClose={onClose}
            title={isAdding ? 'Agregar contacto' : 'Información de contacto'}
        >
            <FieldLabel>Teléfono</FieldLabel>
            <TextInput
                mode="outlined"
                placeholder="Ej. +54 9 11 4455-2210"
                value={cellphone}
                onChangeText={setCellphone}
                keyboardType="phone-pad"
                style={{ backgroundColor: '#fff', marginBottom: 12 }}
            />

            <FieldLabel>Email</FieldLabel>
            <TextInput
                mode="outlined"
                placeholder="Ej. nombre@mail.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ backgroundColor: '#fff' }}
            />

            <Button
                mode="contained"
                onPress={() => onSave({ email, cellphone })}
                loading={isSaving}
                disabled={isSaving}
                style={{ marginTop: 20, borderRadius: 24 }}
                contentStyle={{ height: 48 }}
            >
                {isAdding ? 'Guardar' : 'Guardar cambios'}
            </Button>
        </BottomSheetModal>
    );
}

// ---------- Estilos ----------

const FieldLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
`;
