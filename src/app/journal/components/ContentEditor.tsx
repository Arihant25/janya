'use client';

// ...existing imports...

interface ContentEditorProps {
    title: string;
    content: string;
    onTitleChange: (title: string) => void;
    onContentChange: (content: string) => void;
}

export default function ContentEditor({ title, content, onTitleChange, onContentChange }: ContentEditorProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">💭</span>
                Your thoughts
                <span className="text-sm font-normal text-gray-500">(optional)</span>
            </h3>

            {/* Title Input */}
            <input
                type="text"
                placeholder="Give your entry a title (optional)"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Content Textarea */}
            <textarea
                placeholder="What's on your mind today? Share your thoughts, experiences, or just how you're feeling... (optional)"
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={8}
            />

            {/* Word Count */}
            <div className="mt-2 text-sm text-gray-500 text-right">
                {content.trim().split(' ').filter(word => word.length > 0).length} words
            </div>
        </div>
    );
}
