import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, users: 240 },
  { name: 'Feb', revenue: 3000, users: 139 },
  { name: 'Mar', revenue: 2000, users: 980 },
  { name: 'Apr', revenue: 2780, users: 390 },
  { name: 'May', revenue: 1890, users: 480 },
  { name: 'Jun', revenue: 2390, users: 380 },
  { name: 'Jul', revenue: 3490, users: 430 },
];

export function OverviewChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'revenue' ? `$${value}` : value,
              name === 'revenue' ? 'Revenue' : 'Users'
            ]}
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="users" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}