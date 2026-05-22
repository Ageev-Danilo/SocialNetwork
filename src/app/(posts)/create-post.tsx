import { router } from 'expo-router';
import { Body } from '@/components';
import { PostsForm } from '@/modules/posts';

export default function CreatePostScreen() {
    return (
        <Body>
            <PostsForm onSuccess={() => router.back()} onClose={() => router.back()} />
        </Body>
    );
}