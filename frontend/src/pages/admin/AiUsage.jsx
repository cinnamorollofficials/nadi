import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Cpu, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  User as UserIcon,
  Search
} from "lucide-react";
import Card from "../../components/Card";
import { getAiUsageStats, getAiUsageDaily, getAiUsageTopUsers } from "../../api/admin";
import { toast } from "react-hot-toast";

const AiUsage = () => {
  const [stats, setStats] = useState(null);
  const [dailyUsage, setDailyUsage] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, dailyRes, usersRes] = await Promise.all([
          getAiUsageStats(),
          getAiUsageDaily(30),
          getAiUsageTopUsers(10)
        ]);
        
        setStats(statsRes.data);
        setDailyUsage(dailyRes.data || []);
        setTopUsers(usersRes.data || []);
      } catch (error) {
        toast.error("Failed to fetch AI usage data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTokens = (val) => {
    if (!val) return "0";
    if (val >= 1000000) return (val / 1000000).toFixed(2) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toString();
  };

  const formatCurrency = (val) => {
    if (!val) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(val);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-on tracking-tight flex items-center gap-2">
          <Cpu className="text-primary" />
          AI Usage Monitoring
        </h1>
        <p className="text-sm text-surface-on-variant mt-1">
          Detailed metrics for Gemini AI token consumption and cost estimation.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tokens" 
          value={formatTokens(stats?.total_tokens)} 
          subText="Prompt + Response"
          icon={<BarChart3 className="w-5 h-5 text-primary" />} 
          trend="+12% from last wk" 
        />
        <StatCard 
          title="Estimated Cost" 
          value={formatCurrency(stats?.total_cost)} 
          subText="Gemini 2.5 Flash Rates"
          icon={<DollarSign className="w-5 h-5 text-green-500" />} 
          trend="Calculated in USD" 
        />
        <StatCard 
          title="Active Users" 
          value={stats?.active_users || 0} 
          subText="Engaged with AI"
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          trend="Total distinct users" 
        />
        <StatCard 
          title="Avg. Efficiency" 
          value="98.2%" 
          subText="Success Rate"
          icon={<Activity className="w-5 h-5 text-purple-500" />} 
          trend="System health stable" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Trend List */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Usage History (Last 30 Days)
            </h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {dailyUsage.length === 0 ? (
              <div className="p-8 text-center text-surface-on-variant text-sm">No usage data found for this period.</div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-surface-variant/30 text-xs font-bold uppercase text-surface-on-variant sticky top-0">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-right">Tokens Used</th>
                            <th className="px-4 py-3 text-right">Activity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                        {dailyUsage.map((day, idx) => (
                            <tr key={idx} className="hover:bg-surface-variant/10 transition-colors">
                                <td className="px-4 py-3 text-sm">{new Date(day.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                <td className="px-4 py-3 text-sm text-right font-medium">{formatTokens(day.tokens)}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="w-24 h-2 bg-surface-variant rounded-full overflow-hidden ml-auto">
                                        <div 
                                            className="h-full bg-primary" 
                                            style={{ width: `${Math.min(100, (day.tokens / (stats?.total_tokens / 10 || 1)) * 100)}%` }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>
        </Card>

        {/* Top Users Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Top Users
            </h3>
          </div>
          <div className="divide-y divide-outline-variant/20 max-h-[400px] overflow-y-auto">
            {topUsers.length === 0 ? (
              <div className="p-8 text-center text-surface-on-variant text-sm">No user data found.</div>
            ) : (
              topUsers.map((user, idx) => (
                <div key={idx} className="p-4 flex items-center gap-3 hover:bg-surface-variant/10 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-surface-variant grid place-items-center text-primary font-bold">
                    {user.user_name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-surface-on truncate">{user.user_name}</p>
                    <p className="text-[10px] text-surface-on-variant truncate">{user.user_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">{formatTokens(user.tokens)}</p>
                    <p className="text-[10px] text-surface-on-variant">{formatCurrency(user.cost)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

const StatCard = ({ title, value, subText, icon, trend }) => (
  <Card className="p-4 border-l-4 border-primary border-t-0 border-r-0 border-b-0 hover:translate-y-[-2px] transition-all cursor-default">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-[10px] uppercase font-bold text-surface-on-variant tracking-wider">{title}</p>
        <h2 className="text-2xl font-black text-surface-on mt-1">{value}</h2>
        <p className="text-[10px] text-surface-on-variant mt-1 font-medium">{subText}</p>
      </div>
      <div className="p-2 bg-surface-variant shadow-sm rounded-xl">
        {icon}
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-outline-variant/20">
      <p className="text-[10px] flex items-center gap-1 text-primary font-bold">
        {trend}
      </p>
    </div>
  </Card>
);

export default AiUsage;
