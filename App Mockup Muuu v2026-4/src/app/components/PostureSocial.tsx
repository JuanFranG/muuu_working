import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy,
  Users,
  Share2,
  Heart,
  MessageCircle,
  Crown,
  Flame,
  Target,
  TrendingUp,
  Medal,
  Star,
  Award
} from 'lucide-react';

const leaderboard = [
  { 
    id: 1, 
    name: 'Sarah Chen', 
    score: 92, 
    streak: 14, 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
    level: 15,
    rank: 1
  },
  { 
    id: 2, 
    name: 'Mike Johnson', 
    score: 89, 
    streak: 12, 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    level: 13,
    rank: 2
  },
  { 
    id: 3, 
    name: 'You', 
    score: 85, 
    streak: 7, 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    level: 12,
    rank: 3
  },
  { 
    id: 4, 
    name: 'Emily Davis', 
    score: 82, 
    streak: 9, 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    level: 11,
    rank: 4
  },
  { 
    id: 5, 
    name: 'David Kim', 
    score: 78, 
    streak: 5, 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
    level: 10,
    rank: 5
  }
];

const achievements = [
  {
    id: 1,
    user: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
    achievement: 'Perfect Week',
    description: 'Maintained 90%+ posture for 7 days straight!',
    time: '2 hours ago',
    likes: 12,
    comments: 3
  },
  {
    id: 2,
    user: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    achievement: 'Streak Master',
    description: 'Reached a 12-day streak milestone!',
    time: '5 hours ago',
    likes: 8,
    comments: 2
  },
  {
    id: 3,
    user: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    achievement: 'Early Bird',
    description: 'Completed morning stretches 5 days in a row!',
    time: '1 day ago',
    likes: 15,
    comments: 4
  }
];

const challenges = [
  {
    id: 1,
    title: 'Perfect Posture Week',
    description: 'Maintain 90%+ posture score for 7 consecutive days',
    participants: 23,
    timeLeft: '4 days left',
    reward: '500 points',
    difficulty: 'Hard'
  },
  {
    id: 2,
    title: 'Stretch Break Champion',
    description: 'Take 5 stretch breaks daily for a week',
    participants: 45,
    timeLeft: '2 days left',
    reward: '300 points',
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Morning Warrior',
    description: 'Complete morning posture routine 5 times',
    participants: 67,
    timeLeft: '6 days left',
    reward: '200 points',
    difficulty: 'Easy'
  }
];

export function PostureSocial() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-sm font-bold">#{rank}</span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Current Position</p>
                  <p className="text-2xl font-bold">#3</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Points to #2</p>
                  <p className="text-lg font-semibold">120 points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map((user) => (
                <div 
                  key={user.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    user.name === 'You' 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-background'
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(user.rank)}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        Level {user.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {user.score}% score
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {user.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Friend Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={achievement.avatar} />
                      <AvatarFallback>{achievement.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{achievement.user}</span>
                        <Badge variant="secondary" className="text-xs">
                          <Trophy className="h-3 w-3 mr-1" />
                          {achievement.achievement}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.time}</p>
                    </div>
                  </div>
                  <p className="text-sm">{achievement.description}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{achievement.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{achievement.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {challenge.participants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {challenge.reward}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{challenge.timeLeft}</p>
                      <Button size="sm" className="mt-2 text-xs px-3 py-1 h-7">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}