import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { 
  Bell,
  Vibrate,
  Volume2,
  Clock,
  Target,
  Heart,
  Shield,
  Smartphone,
  Settings,
  Moon,
  Sun,
  Palette,
  Globe,
  HelpCircle
} from 'lucide-react';

export function PostureSettings() {
  const [notifications, setNotifications] = useState({
    postureReminders: true,
    stretchBreaks: true,
    achievements: true,
    social: false,
    weeklyReports: true
  });

  const [notificationStyle, setNotificationStyle] = useState('supportive');
  const [reminderInterval, setReminderInterval] = useState([30]);
  const [breakInterval, setBreakInterval] = useState([60]);
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const notificationStyles = [
    { 
      id: 'supportive', 
      name: 'Supportive', 
      description: 'Gentle, encouraging reminders',
      example: '"Great job! Let\'s adjust your posture slightly 😊"'
    },
    { 
      id: 'neutral', 
      name: 'Neutral', 
      description: 'Simple, direct notifications',
      example: '"Please check your posture"'
    },
    { 
      id: 'strict', 
      name: 'Strict', 
      description: 'Firm, no-nonsense reminders',
      example: '"Poor posture detected. Correct immediately."'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Posture Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified when posture needs adjustment</p>
              </div>
              <Switch 
                checked={notifications.postureReminders} 
                onCheckedChange={(checked) => setNotifications({...notifications, postureReminders: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Stretch Break Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders to take stretch breaks</p>
              </div>
              <Switch 
                checked={notifications.stretchBreaks} 
                onCheckedChange={(checked) => setNotifications({...notifications, stretchBreaks: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Achievement Notifications</Label>
                <p className="text-sm text-muted-foreground">Celebrate your progress and milestones</p>
              </div>
              <Switch 
                checked={notifications.achievements} 
                onCheckedChange={(checked) => setNotifications({...notifications, achievements: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Social Updates</Label>
                <p className="text-sm text-muted-foreground">Friend activities and challenges</p>
              </div>
              <Switch 
                checked={notifications.social} 
                onCheckedChange={(checked) => setNotifications({...notifications, social: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Summary of your weekly progress</p>
              </div>
              <Switch 
                checked={notifications.weeklyReports} 
                onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Notification Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationStyles.map((style) => (
            <div 
              key={style.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                notificationStyle === style.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:bg-muted/50'
              }`}
              onClick={() => setNotificationStyle(style.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    notificationStyle === style.id ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                  <span className="font-medium">{style.name}</span>
                </div>
                {notificationStyle === style.id && (
                  <Badge variant="secondary">Selected</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{style.description}</p>
              <p className="text-xs text-muted-foreground italic">{style.example}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reminder Intervals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reminder Intervals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Posture Check Interval</Label>
            <div className="px-3">
              <Slider
                value={reminderInterval}
                onValueChange={setReminderInterval}
                max={120}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>5 min</span>
                <span className="font-medium">{reminderInterval[0]} minutes</span>
                <span>120 min</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Stretch Break Interval</Label>
            <div className="px-3">
              <Slider
                value={breakInterval}
                onValueChange={setBreakInterval}
                max={180}
                min={30}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>30 min</span>
                <span className="font-medium">{breakInterval[0]} minutes</span>
                <span>180 min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound & Vibration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound & Vibration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-muted-foreground">Play sound with notifications</p>
            </div>
            <Switch 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Vibration</Label>
              <p className="text-sm text-muted-foreground">Vibrate device for alerts</p>
            </div>
            <Switch 
              checked={vibrationEnabled} 
              onCheckedChange={setVibrationEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            App Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Device Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Device Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Device Name</Label>
            <Input defaultValue="Alex's SitBax Band" />
          </div>
          
          <div className="space-y-2">
            <Label>Calibration Sensitivity</Label>
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Less sensitive</SelectItem>
                <SelectItem value="medium">Medium - Balanced</SelectItem>
                <SelectItem value="high">High - More sensitive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="w-full">
            Recalibrate Device
          </Button>
        </CardContent>
      </Card>

      {/* Account & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Account & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Globe className="h-4 w-4 mr-2" />
            Help Center
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Bell className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Separator />
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">SitBax v1.0.2</p>
          </div>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}