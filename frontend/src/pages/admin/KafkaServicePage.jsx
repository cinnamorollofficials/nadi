import { useQuery } from "@tanstack/react-query";
import { getHealthStatus } from "../../api/admin";
import Button from "../../components/Button";
import Card from "../../components/Card";

const KafkaServicePage = () => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["health-status"],
        queryFn: getHealthStatus,
        refetchInterval: 10000,
    });

    const kafkaStatus = data?.data?.kafka || "unknown";
    const isOnline = kafkaStatus === "connected";

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-outline-variant/30">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-surface-on flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.4 7 12 11.2 4.6 7 12 4.8zm-8 10.8v-7.2l7.2 4.1v7.2L4 15.6zm16 0l-7.2 4.1v-7.2l7.2-4.1v7.2z"/>
                            </svg>
                        </div>
                        Kafka Broker
                    </h1>
                    <p className="text-surface-on-variant font-medium opacity-70">Event streaming and real-time data pipelines</p>
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

            <div className="grid md:grid-cols-1 gap-8">
                {/* Status Card */}
                <Card className="p-8 border-none bg-surface-container-low backdrop-blur-xl ring-1 ring-outline-variant/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>
                        </svg>
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-surface-on-variant opacity-60">Message Broker Status</h3>
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                isOnline ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                                {isOnline && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                {kafkaStatus}
                            </div>
                        </div>

                        <div className="space-y-4 max-w-2xl">
                            <p className="text-5xl font-bold text-surface-on tracking-tight">
                                {isOnline ? "Operational" : "Service Offline"}
                            </p>
                            <p className="text-lg text-surface-on-variant opacity-80 font-medium leading-relaxed">
                                {isOnline 
                                    ? "The Kafka producer and consumer groups are successfully registered and processing events in real-time." 
                                    : "Failed to connect to the Kafka cluster. Services relying on asynchronous messaging will be degraded."}
                            </p>
                        </div>

                        <div className="pt-8 border-t border-outline-variant/10 grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase text-surface-on-variant opacity-70 mb-1">Service Type</p>
                                <p className="text-base font-semibold text-surface-on">Event Bus</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-surface-on-variant opacity-70 mb-1">Architecture</p>
                                <p className="text-base font-semibold text-surface-on">Distributed</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-surface-on-variant opacity-70 mb-1">Uptime</p>
                                <p className="text-base font-semibold text-surface-on">99.9%</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase text-surface-on-variant opacity-70 mb-1">Latency</p>
                                <p className="text-base font-semibold text-surface-on">~5ms</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Topics Info */}
            <Card className="p-6 border-none bg-surface-container-high rounded-3xl ring-1 ring-outline-variant/10">
                <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-surface-on">System Pipeline Information</h4>
                        <p className="text-xs text-surface-on-variant font-medium leading-relaxed opacity-80">
                            Kafka is used for system-wide auditing, log aggregation, and real-time analytic processing. 
                            It ensures that high-volume operations are processed asynchronously without blocking the main application flow.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default KafkaServicePage;
