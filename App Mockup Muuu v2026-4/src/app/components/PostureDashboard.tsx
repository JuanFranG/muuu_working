import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Zap,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  Timer,
  Activity
} from 'lucide-react';

interface User {
  name: string;
  level: number;
  points: number;
  streak: number;
  postureScore: number;
  pointsToNextLevel: number;
  totalPointsForNextLevel: number;
}

interface PostureDashboardProps {
  user: User;
}

export function PostureDashboard({ user }: PostureDashboardProps) {
  const todaysGoals = [
    { id: 1, title: 'Maintain good posture for 4 hours', progress: 75, completed: false, points: 50 },
    { id: 2, title: 'Complete 3 stretch breaks', progress: 100, completed: true, points: 30 },
    { id: 3, title: 'Achieve 90% posture score', progress: 85, completed: false, points: 100 },
  ];

  const achievements = [
    { id: 1, title: 'Week Warrior', description: '7-day streak!', icon: Trophy, color: 'text-yellow-500', unlocked: true },
    { id: 2, title: 'Perfect Posture', description: '100% score achieved', icon: Award, color: 'text-blue-500', unlocked: true },
    { id: 3, title: 'Early Bird', description: 'Morning stretches', icon: Clock, color: 'text-green-500', unlocked: false },
  ];

  const currentPostureStatus = {
    status: 'good',
    message: 'Great posture! Keep it up!',
    color: 'text-green-500',
    icon: CheckCircle
  };

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Level {user.level} Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Points: {user.totalPointsForNextLevel - user.pointsToNextLevel}/{user.totalPointsForNextLevel}</span>
              <span>{user.pointsToNextLevel} points to Level {user.level + 1}</span>
            </div>
            <Progress 
              value={((user.totalPointsForNextLevel - user.pointsToNextLevel) / user.totalPointsForNextLevel) * 100} 
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Posture Status */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <currentPostureStatus.icon className={`h-6 w-6 ${currentPostureStatus.color}`} />
            </div>
            <div>
              <h3 className="font-semibold">Current Posture</h3>
              <p className="text-sm text-muted-foreground">{currentPostureStatus.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Today's Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todaysGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {goal.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {goal.title}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  +{goal.points} points
                </Badge>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={achievement.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                    <Icon className={`h-4 w-4 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Unlocked!
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Activity className="h-6 w-6" />
          <span className="text-sm">Take Break</span>
        </Button>
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Timer className="h-6 w-6" />
          <span className="text-sm">Start Session</span>
        </Button>
      </div>
    </div>
  );
}