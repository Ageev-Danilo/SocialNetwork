import { useState } from 'react';
import { Button, Icon } from '@/shared/ui';
import { CreateGroupModal } from '@/modules/chat';

export function CreateGroupButton() {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button type="outline" onPress={() => setVisible(true)}>
                <Icon.add />
            </Button>
            <CreateGroupModal
                visible={visible}
                onClose={() => setVisible(false)}
            />
        </>
    );
}
