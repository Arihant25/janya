'use client';

// ...existing imports...

interface MediaUploadProps {
    photo: File | null;
    audioBlob: Blob | null;
    isRecording: boolean;
    onPhotoChange: (file: File | null) => void;
    onAudioChange: (blob: Blob | null) => void;
    onRecordingChange: (recording: boolean) => void;
}

export default function MediaUpload({
    photo,
    audioBlob,
    isRecording,
    onPhotoChange,
    onAudioChange,
    onRecordingChange
}: MediaUploadProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Add media
                <span className="text-sm font-normal text-gray-500">(optional)</span>
            </h3>

            {/* ...existing media upload components... */}
        </div>
    );
}
