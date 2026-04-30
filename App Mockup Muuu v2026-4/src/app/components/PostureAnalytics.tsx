import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Target,
  Activity,
  Zap,
  Timer
} from 'lucide-react';

const weeklyData = [
  { day: 'Mon', score: 78, hours: 6.5, breaks: 4 },
  { day: 'Tue', score: 82, hours: 7.2, breaks: 5 },
  { day: 'Wed', score: 85, hours: 8.1, breaks: 6 },
  { day: 'Thu', score: 79, hours: 6.8, breaks: 4 },
  { day: 'Fri', score: 88, hours: 7.5, breaks: 5 },
  { day: 'Sat', score: 92, hours: 5.2, breaks: 3 },
  { day: 'Sun', score: 85, hours: 4.8, breaks: 3 }
];

const monthlyData = [
  { week: 'Week 1', score: 82, streak: 5 },
  { week: 'Week 2', score: 85, streak: 7 },
  { week: 'Week 3', score: 88, streak: 6 },
  { week: 'Week 4', score: 90, streak: 8 }
];

const postureBreakdown = [
  { name: 'Excellent', value: 35, color: '#22c55e' },
  { name: 'Good', value: 45, color: '#3b82f6' },
  { name: 'Fair', value: 15, color: '#f59e0b' },
  { name: 'Poor', value: 5, color: '#ef4444' }
];

export function PostureAnalytics() {
  const stats = [
    { label: 'Weekly Average', value: '84%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Hours', value: '6.4h', icon: Clock, color: 'text-blue-500' },
    { label: 'Stretch Breaks', value: '32', icon: Activity, color: 'text-orange-500' },
    { label: 'Best Streak', value: '12 days', icon: Award, color: 'text-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#000000' }}
                      name="Posture Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Daily Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Active Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold">Monthly Insights</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Improvement Rate</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">+8% this month</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Best Performance</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Week 4 - 90%</Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Posture Quality Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={postureBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {postureBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {postureBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Active Time</span>
                <span className="font-semibold">47.8 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Stretch Breaks Taken</span>
                <span className="font-semibold">32 breaks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Daily Score</span>
                <span className="font-semibold">84%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Improvement from Last Week</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">+6%</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}