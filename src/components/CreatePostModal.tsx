import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { PostsForm } from '@/modules/posts';

const { height: SCREEN_H } = Dimensions.get('window');

interface Props { visible: boolean; onClose: () => void; }

export function CreatePostModal({ visible, onClose }: Props) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Створення публікації</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <PostsForm onSuccess={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex:            1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent:  'center',
        alignItems:      'center',
        padding:         20,
    },
    modalCard: {
        width:           '100%',
        height:          SCREEN_H * 0.75,
        backgroundColor: '#fff',
        borderRadius:    28,
        overflow:        'hidden',
    },
    header: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        alignItems:        'center',
        paddingHorizontal: 20,
        paddingTop:        22,
        paddingBottom:     12,
    },
    title:    { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
    closeBtn: { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    closeText: { fontSize: 20, color: '#000', fontWeight: '300' },
});