import { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'react-native-paper';
import Stepper from '../components/Stepper';
import ConfigureWifiStep from '../components/steps/ConfigureWifiStep';
import LinkStep from '../components/steps/LinkStep';
import ScanQRStep from '../components/steps/ScanQrStep';

const Container = styled.View`
  flex: 1;
`;

export default function LinkDeviceScreen() {
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [ScanQRStep, ConfigureWifiStep, LinkStep];
    const labels = ['Escanear QR', 'Configurar WiFi', 'Vincular'];
    const CurrentStep = steps[currentStep];

    const onNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const onBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <Stepper
                current={currentStep}
                total={steps.length}
                label={labels[currentStep]}
            />
            <CurrentStep onNext={onNext} onBack={onBack} />
        </Container>
    );
}