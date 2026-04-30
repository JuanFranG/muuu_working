import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Home, 
  BarChart3, 
  Settings, 
  Users, 
  Trophy,
  Zap,
  Target,
  Calendar,
  MessageSquare,
  Flame,
  Star,
  TrendingUp,
  Clock,
  Award,
  Heart,
  Smile,
  User,
  Compass,
  UserCheck,
  Bell,
  MapPin,
  Search,
  Filter,
  Globe,
  Crown,
  Medal,
  Share2,
  MessageCircle,
  Briefcase,
  GraduationCap,
  FileText,
  Download,
  Upload,
  Camera,
  X,
  Mail,
  Phone,
  MapPin as Location,
  Calendar as CalendarIcon,
  Building,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  XCircle,
  Eye,
  Menu,
  Send,
  ArrowLeft,
  Bookmark,
  Moon,
  Sun,
  Shield,
  Accessibility,
  Languages,
  Info,
  HelpCircle,
  LogOut,
  Trash2,
  Hash,
  FileCheck,
  RotateCcw,
  Edit,
  Save,
  CreditCard,
  Plus,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Timer
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

import worldMapImage from 'figma:asset/64a3360c68ea4780e1411238bd5fcb9bcb9c78b5.png';

import { PostureDashboard } from './PostureDashboard';
import { PostureCoach } from './PostureCoach';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

export function PostureApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCoach, setShowCoach] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main', 'notifications', 'messages', 'settings-menu', 'chat'
  const [searchLocation, setSearchLocation] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [jobName, setJobName] = useState('');
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [likedJobs, setLikedJobs] = useState<Set<number>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());
  const [darkMode, setDarkMode] = useState(false);
  const [hasPdfUploaded, setHasPdfUploaded] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [canEditProfile, setCanEditProfile] = useState(true); // Control access to edit
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [workModality, setWorkModality] = useState(''); // New state for work modality
  
  // Long press states
  const [longPressedItem, setLongPressedItem] = useState<{type: 'application' | 'chat', id: number} | null>(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'application' | 'chat', id: number, title: string} | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const navigationItems = [
    { id: 'dashboard', icon: Home },
    { id: 'analytics', icon: Globe },
    { id: 'social', icon: Heart },
    { id: 'settings', icon: () => (
      <Avatar className="h-5 w-5">
        <AvatarImage 
          src="https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NTgxNzQ4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
          alt="Profile"
        />
        <AvatarFallback className="text-xs">AM</AvatarFallback>
      </Avatar>
    ) },
  ];

  // Return a simple placeholder component since this appears to be a complex app
  return (
    <div className="h-full bg-white">
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-card border-b px-4 py-3">
          <div className="flex items-center gap-3">

            <h1 className="font-semibold">Zafiro</h1>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Aplicación de Empleo Zafiro</h2>
            <p className="text-muted-foreground">
              De gemas en bruto, a profesionales con fruto. Empleabilidad hecha oportunidad.
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="border-t p-4">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <IconComponent />
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}