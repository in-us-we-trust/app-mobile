import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Button, Switch, TextInput } from 'react-native-paper';
import { BottomSheetModal } from './BottomSheetModal';
import { Contact } from '../types';

export type PersonalInfoFormData = {
    firstName: string;
    lastName: string;
    role: string;
    notify: boolean;
};

type EditPersonalInfoModalProps = {
    visible: boolean;
    contact: Contact;
    isSaving: boolean;
    onClose: () => void;
    onSave: (data: PersonalInfoFormData) => void;
};

export function EditPersonalInfoModal({
    visible,
    contact,
    isSaving,
    onClose,
    onSave,
}: EditPersonalInfoModalProps) {
    const [firstName, setFirstName] = useState(contact.firstName);
    const [lastName, setLastName] = useState(contact.lastName);
    const [role, setRole] = useState(contact.relation);
    const [notify, setNotify] = useState(contact.notify);

    useEffect(() => {
        if (visible) {
            setFirstName(contact.firstName);
            setLastName(contact.lastName);
            setRole(contact.relation);
            setNotify(contact.notify);
        }
    }, [visible, contact]);

    return (
        <BottomSheetModal visible={visible} onClose={onClose} title="Información personal">
            <FieldLabel>Nombre</FieldLabel>
            <TextInput
                mode="outlined"
                value={firstName}
                onChangeText={setFirstName}
                style={{ backgroundColor: '#fff', marginBottom: 12 }}
            />

            <FieldLabel>Apellido</FieldLabel>
            <TextInput
                mode="outlined"
                value={lastName}
                onChangeText={setLastName}
                style={{ backgroundColor: '#fff', marginBottom: 12 }}
            />

            <FieldLabel>Relación / Rol</FieldLabel>
            <TextInput
                mode="outlined"
                value={role}
                onChangeText={setRole}
                style={{ backgroundColor: '#fff' }}
            />

            {contact.type === 'cercano' && (
                <SwitchRow>
                    <SwitchTextWrapper>
                        <SwitchTitle>Notificar en incidentes</SwitchTitle>
                        <SwitchDescription>Le llega una alerta si pasa algo.</SwitchDescription>
                    </SwitchTextWrapper>
                    <Switch value={notify} onValueChange={setNotify} color="#6C4EF5" />
                </SwitchRow>
            )}

            <Button
                mode="contained"
                onPress={() => onSave({ firstName, lastName, role, notify })}
                loading={isSaving}
                disabled={isSaving || !firstName.trim()}
                style={{ marginTop: 20, borderRadius: 24 }}
                contentStyle={{ height: 48 }}
            >
                Guardar cambios
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

const SwitchRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const SwitchTextWrapper = styled.View`
  flex: 1;
  padding-right: 12px;
`;

const SwitchTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const SwitchDescription = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;
