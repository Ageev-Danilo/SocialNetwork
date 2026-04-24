import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { PersonalInfo } from '@/components/settings/PersonalInfo';
import { Signature } from '@/components/settings/Signature';
import { ProfileCardModal } from '@/components/settings/modals/ProfileCardModal';
import { PersonalInfoModal } from '@/components/settings/modals/PersonalInfoModal';
import { SignatureModal } from '@/components/settings/modals/SignatureModal';

type ModalType = 'profileCard' | 'personalInfo' | 'signature' | null;

export default function SettingsScreen() {
    const [activeTab, setActiveTab] = useState<'info' | 'albums'>('info');
    const [openModal, setOpenModal] = useState<ModalType>(null);

    return (
        <View style={styles.container}>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'info' && styles.tabActive]}
                    onPress={() => setActiveTab('info')}
                >
                    <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
                        Особиста інформація
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'albums' && styles.tabActive]}
                    onPress={() => setActiveTab('albums')}
                >
                    <Text style={[styles.tabText, activeTab === 'albums' && styles.tabTextActive]}>
                        Альбоми
                    </Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'info' && (
                <ScrollView contentContainerStyle={styles.content}>
                    <ProfileCard onEdit={() => setOpenModal('profileCard')} />
                    <PersonalInfo onEdit={() => setOpenModal('personalInfo')} />
                    <Signature onEdit={() => setOpenModal('signature')} />
                </ScrollView>
            )}

            {activeTab === 'albums' && (
                <View style={styles.content}>
                    <Text style={styles.placeholder}>Альбоми — незабаром</Text>
                </View>
            )}

            {/* Modals */}
            <ProfileCardModal
                visible={openModal === 'profileCard'}
                onClose={() => setOpenModal(null)}
            />
            <PersonalInfoModal
                visible={openModal === 'personalInfo'}
                onClose={() => setOpenModal(null)}
            />
            <SignatureModal
                visible={openModal === 'signature'}
                onClose={() => setOpenModal(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f4ff',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#543C52',
    },
    tabText: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#543C52',
    },
    content: {
        padding: 16,
        gap: 12,
    },
    placeholder: {
        textAlign: 'center',
        color: '#888',
        marginTop: 40,
        fontSize: 15,
    },
});