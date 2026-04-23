import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import logApi from '../../api/log';
import { safeStringify } from '../../utils/json';
import { usePermission } from '../../hooks/usePermission';
import { PERMS } from '../../utils/permissions';

const Logs = () => {
    const { hasPermission } = usePermission();
    const { type: logType } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState(''); // Categorical filter: 'database', 'redis', etc.
    const [isExporting, setIsExporting] = useState(false);

    // Reset page to 1 when log type changes
    useEffect(() => {
        setCurrentPage(1);
        setActiveFilter('');
        setSearchQuery('');
    }, [logType]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['logs', logType],
        queryFn: () => logApi.getLogs({ type: logType }),
    });

    const allColumns = [
        {
            header: 'Level',
            accessor: 'level',
            render: (row) => (
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${row.level === 'info' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    row.level === 'warn' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                        'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                    {row.level}
                </span>
            )
        },
        {
            header: 'Action',
            accessor: 'action',
            render: (row) => (
                <div className="truncate max-w-[200px] text-sm text-surface-on font-medium" title={row.action}>
                    {row.action || row.message?.substring(0, 50) + '...'}
                </div>
            )
        },
        {
            header: 'Time',
            accessor: 'time',
            render: (row) => {
                const date = new Date(row.time);
                return (
                    <div className="whitespace-nowrap text-xs text-surface-on-variant">
                        {date.toLocaleString()}
                    </div>
                );
            }
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (row) => (
                <button
                    onClick={() => {
                        setSelectedLog(row);
                        setIsDetailsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-surface-variant/40 transition-colors text-primary"
                    title="Detail"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
            )
        }
    ];

    const columns = logType === 'system'
        ? allColumns.filter(col => ['level', 'time', 'id'].includes(col.accessor))
        : allColumns;

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading logs: {error.message}</p>
            </div>
        );
    }

    const allLogs = data?.data || [];

    const filteredLogs = allLogs.filter(log => {
        // Priority 1: Categorical filter (Source)
        if (activeFilter) {
            const source = log.source?.toLowerCase() || '';
            if (source !== activeFilter) return false;
        }

        // Priority 2: Text search
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        const inMessage = log.message?.toLowerCase().includes(query);
        const inAction = log.action?.toLowerCase().includes(query);
        const inRequestId = log.request_id?.toLowerCase().includes(query);
        const inDetails = log.details && safeStringify(log.details).toLowerCase().includes(query);
        return inMessage || inAction || inRequestId || inDetails;
    });

    const totalItems = filteredLogs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Manual pagination for now as the backend returns all logs
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderJsonBlock = (data) => {
        if (!data) return <div className="text-surface-on-variant italic">Empty</div>;
        
        const jsonString = safeStringify(data, null, 2);
        
        return (
            <pre className="p-4 bg-gray-900 dark:bg-black text-green-400 rounded-lg overflow-auto text-xs font-mono border border-outline-variant/30 relative group">
                <button
                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(jsonString);
                    }}
                    title="Copy to clipboard"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
                {jsonString}
            </pre>
        );
    };

    const handleExport = async (format) => {
        setIsExporting(true);
        try {
            let response;
            if (logType === 'system') {
                response = await logApi.exportSystemLogs(format);
            } else if (logType === 'audit') {
                response = await logApi.exportAuditLogs(format);
            } else {
                response = await logApi.exportLogs(format);
            }
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = format === 'csv' ? `${logType}_logs.csv` : `${logType}_logs.xlsx`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-on tracking-tight">
                        {logType.charAt(0).toUpperCase() + logType.slice(1)} Logs
                    </h1>
                    <p className="text-surface-on-variant mt-2">Monitor {logType} activities and trails</p>
                </div>
                {hasPermission(PERMS.SYSTEM_EXPORT) && (
                    <div className="flex bg-surface-container border border-outline-variant/50 p-1 rounded-lg shrink-0 shadow-sm">
                        <button
                            onClick={() => handleExport('excel')}
                            className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
                            disabled={isExporting}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Excel
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            className="px-3 py-1.5 text-xs font-semibold hover:bg-surface-variant/30 rounded-md transition-all flex items-center gap-1.5 text-surface-on disabled:opacity-50"
                            disabled={isExporting}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            CSV
                        </button>
                    </div>
                )}
            </div>

            <Card className="mb-6 p-4 flex flex-col md:flex-row gap-4 items-start md:items-center bg-surface border border-outline-variant/30">
                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-sm font-medium text-surface-on-variant mb-1">Search Logs</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-on-variant pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Filter by message, ID, or details..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-10 py-2 bg-surface hover:bg-surface-variant/10 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-surface-on transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-on-variant hover:text-surface-on"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {logType === 'system' && (
                    <div className="flex flex-col gap-1 shrink-0">
                        <label className="block text-sm font-medium text-surface-on-variant mb-1">Quick Filters</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Database', value: 'database' },
                                { label: 'Redis', value: 'redis' },
                                { label: 'Kafka', value: 'kafka' },
                                { label: 'Rate Limit', value: 'rate_limit' }
                            ].map(filter => (
                                <button
                                    key={filter.value}
                                    onClick={() => {
                                        setActiveFilter(filter.value === activeFilter ? '' : filter.value);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${activeFilter === filter.value
                                            ? 'bg-primary text-primary-on'
                                            : 'bg-surface-variant/30 text-surface-on hover:bg-surface-variant/50 border border-outline-variant/30'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-end self-end lg:self-center">
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setActiveFilter('');
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-surface-variant/30 hover:bg-surface-variant/50 text-surface-on rounded-md transition-colors text-sm font-medium h-[40px] flex items-center"
                    >
                        Clear All
                    </button>
                </div>
            </Card>

            <Card className="p-0 overflow-hidden border border-outline-variant/30 bg-surface-container">
                <Table columns={columns} data={paginatedLogs} loading={isLoading} hideEmptyState={true} />
                {!isLoading && filteredLogs.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onLimitChange={(newLimit) => {
                            setItemsPerPage(newLimit);
                            setCurrentPage(1);
                        }}
                    />
                )}
                {!isLoading && filteredLogs.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-variant/20 text-surface-on-variant mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-surface-on">No logs found</h3>
                        <p className="text-surface-on-variant">There are no log entries matching your criteria.</p>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title="Log Detail"
                maxWidth="max-w-4xl"
            >
                {selectedLog && (
                    <div className="flex flex-col">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-surface-variant/10 rounded-lg border border-outline-variant/30 mb-6">
                            <div>
                                <p className="text-xs text-surface-on-variant mb-1">Log Type & Level</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-surface-on uppercase">{selectedLog.type}</span>
                                    <span className="text-surface-on-variant">•</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${selectedLog.level === 'info' ? 'bg-green-500/10 text-green-600' :
                                            selectedLog.level === 'warn' ? 'bg-yellow-500/10 text-yellow-600' :
                                                'bg-red-500/10 text-red-600'
                                        }`}>
                                        {selectedLog.level}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-surface-on-variant mb-1">Timestamp</p>
                                <p className="text-sm text-surface-on">{new Date(selectedLog.time).toLocaleString()}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-surface-on-variant mb-1">Request ID</p>
                                <p className="text-sm font-mono text-surface-on truncate" title={selectedLog.request_id || '-'}>
                                    {selectedLog.request_id || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                            <div>
                                <h3 className="text-sm font-semibold text-surface-on mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-surface-on-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                    Log Message
                                </h3>
                                <div className="p-4 bg-surface-variant/10 rounded border border-outline-variant/30 text-surface-on text-sm leading-relaxed">
                                    {selectedLog.message}
                                </div>
                            </div>

                            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-surface-on mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-surface-on-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                        Full Details (JSON)
                                    </h3>
                                    {renderJsonBlock(selectedLog.details)}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="px-6 py-2 bg-surface-variant/20 hover:bg-surface-variant/30 text-surface-on rounded-md transition-colors text-sm font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Logs;
