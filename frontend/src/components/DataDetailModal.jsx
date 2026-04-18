import PropTypes from 'prop-types';
import Modal from './Modal';

const DataDetailModal = ({ isOpen, onClose, title, data }) => {
    if (!data) return null;

    // Formatting helpers
    const formatKey = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const isHtml = (value) => {
        if (typeof value !== 'string') return false;
        return /<[a-z][\s\S]*>/i.test(value);
    };

    const formatValue = (key, value) => {
        if (value === null || value === undefined || value === '') return <span className="text-surface-on-variant/40 italic">N/A</span>;
        
        if (typeof value === 'boolean') {
            return (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    value ? 'bg-primary/10 text-primary' : 'bg-surface-variant/30 text-surface-on-variant'
                }`}>
                    {value ? 'Yes' : 'No'}
                </span>
            );
        }

        if (key.toLowerCase().includes('status')) {
            const statusStr = String(value).toLowerCase();
            const colors = {
                active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                inactive: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                published: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                draft: 'bg-surface-variant/30 text-surface-on-variant',
            };
            const colorClass = colors[statusStr] || 'bg-surface-variant/30 text-surface-on-variant';
            return (
                <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${colorClass}`}>
                    {String(value)}
                </span>
            );
        }

        if (key.toLowerCase().endsWith('_at') || key.toLowerCase() === 'created_at' || key.toLowerCase() === 'updated_at') {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleString();
                }
            } catch (e) {
                return String(value);
            }
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-surface-on-variant/40 italic text-xs">None</span>;
            return (
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {value.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-surface-variant/40 rounded text-[10px] font-medium text-surface-on opacity-80 border border-outline-variant/10">
                            {typeof item === 'object' ? (item.name || item.label || JSON.stringify(item)) : String(item)}
                        </span>
                    ))}
                </div>
            );
        }

        if (typeof value === 'object') {
            return <pre className="text-[10px] bg-surface-variant/20 p-2 rounded overflow-x-auto font-mono">{JSON.stringify(value, null, 2)}</pre>;
        }

        // Render HTML for rich text fields
        if (isHtml(value)) {
            return (
                <div 
                    className="mt-1 text-sm text-surface-on leading-relaxed prose-sm max-w-none 
                        [&>p]:mb-3 [&>ul]:mb-3 [&>ul]:pl-5 [&>ul]:list-disc
                        [&>ol]:mb-3 [&>ol]:pl-5 [&>ol]:list-decimal
                        [&>strong]:font-bold [&>em]:italic"
                    dangerouslySetInnerHTML={{ __html: value }}
                />
            );
        }

        return <span className="text-sm text-surface-on leading-relaxed">{String(value)}</span>;
    };

    // Fields to exclude from view
    const excludedFields = ['password', 'secret', 'token', 'deleted_at', 'deletedAt'];
    const filteredEntries = Object.entries(data).filter(([key]) => !excludedFields.some(ex => key.toLowerCase().includes(ex)));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || 'Record Details'}
            maxWidth="max-w-2xl"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 py-2">
                {filteredEntries.map(([key, value]) => {
                    const isRichText = isHtml(value);
                    return (
                        <div key={key} className={`flex flex-col gap-1.5 group ${isRichText ? 'md:col-span-2' : ''}`}>
                            <span className="text-[10px] font-bold text-surface-on-variant uppercase tracking-[0.15em] opacity-60 group-hover:opacity-100 transition-opacity">
                                {formatKey(key)}
                            </span>
                            <div className="min-h-[24px]">
                                {formatValue(key, value)}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant/30 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 text-sm font-bold text-surface-on bg-surface-variant/20 hover:bg-surface-variant/40 rounded-xl transition-all active:scale-95"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

DataDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    data: PropTypes.object,
};

export default DataDetailModal;
