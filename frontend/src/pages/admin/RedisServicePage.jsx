import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getHealthStatus, clearCache } from "../../api/admin";
import Button from "../../components/Button";
import Card from "../../components/Card";

const RedisServicePage = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["health-status"],
        queryFn: getHealthStatus,
        refetchInterval: 10000, // Auto refresh every 10 seconds
    });

    const flushMutation = useMutation({
        mutationFn: clearCache,
        onSuccess: () => {
            toast.success("Redis cache flushed successfully!");
            queryClient.invalidateQueries({ queryKey: ["health-status"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.meta?.message || "Failed to flush Redis");
        }
    });

    const handleFlush = () => {
        if (window.confirm("Are you sure you want to flush all Redis cache? This may temporarily slow down the system.")) {
            flushMutation.mutate();
        }
    };

    const redisStatus = data?.data?.redis || "unknown";
    const isOnline = redisStatus === "connected";

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header section with rich aesthetics */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/30">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.4 7 12 11.2 4.6 7 12 4.8zM4 15.6V8.4l7.2 4.1v7.2L4 15.6zm16 0l-7.2 4.1v-7.2l7.2-4.1v7.2z"/>
                            </svg>
                        </div>
                        Redis Service
                    </h1>
                    <p className="text-surface-on-variant font-medium opacity-70">Monitor and manage your high-performance cache store</p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => refetch()} 
                    isLoading={isLoading}
                    className="rounded-2xl border-outline-variant/30 text-xs uppercase tracking-widest font-bold"
                >
                    Refresh Status
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Status Card */}
                <Card className="p-8 border-none bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
                        </svg>
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-on-variant opacity-60">Connection Status</h3>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isOnline ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                                {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                {redisStatus}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-4xl font-bold text-white tracking-tight">
                                {isOnline ? "Healthy" : "Issue Detected"}
                            </p>
                            <p className="text-sm text-surface-on-variant opacity-70 font-medium">
                                {isOnline ? "Redis cluster is responding within expected latency thresholds." : "Could not establish a reliable connection to the Redis instance."}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-outline-variant/10 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-surface-on-variant opacity-50 mb-1">Provider</p>
                                <p className="text-sm font-semibold text-white">Redis Stack</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-surface-on-variant opacity-50 mb-1">Version</p>
                                <p className="text-sm font-semibold text-white">7.2.4 stable</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Actions Card */}
                <Card className="p-8 border-none bg-white/5 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 space-y-6 h-full flex flex-col">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-on-variant opacity-60 mb-4">Maintenance Actions</h3>
                            <p className="text-sm text-surface-on-variant opacity-70 font-medium mb-8">
                                Flush the entire Redis keyspace. This will invalidate all current user sessions, cached API responses, and transient system data.
                            </p>
                        </div>

                        <div className="mt-auto pt-6 space-y-4">
                            <Button 
                                className="w-full bg-red-600 hover:bg-red-500 text-white rounded-2xl py-4 font-bold shadow-lg shadow-red-900/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                onClick={handleFlush}
                                isLoading={flushMutation.isPending}
                                disabled={!isOnline}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Flush Redis Cache
                            </Button>
                            <p className="text-[10px] text-center text-red-400 font-bold uppercase tracking-widest opacity-60">Caution: This action is destructive</p>
                        </div>
                    </div>
                </Card>
            </div>
            
            {/* System Info */}
            <Card className="p-6 border-none bg-slate-900/40 rounded-3xl ring-1 ring-white/5">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">About Redis Service</h4>
                        <p className="text-xs text-surface-on-variant font-medium leading-relaxed opacity-60">
                            NADI utilizes Redis as its primary cache layer for session management, rate limiting, and database query acceleration. 
                            Regular monitoring ensures optimal performance for end-users. Access to this management panel is restricted to System Administrators.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RedisServicePage;
