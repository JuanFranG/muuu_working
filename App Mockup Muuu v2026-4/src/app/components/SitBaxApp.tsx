import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Heart, 
  X, 
  MessageCircle, 
  MapPin, 
  Search, 
  Filter, 
  User, 
  Briefcase, 
  Home,
  Star,
  Share,
  Clock,
  Building2,
  DollarSign,
  Calendar,
  Eye,
  Send,
  ArrowLeft,
  CheckCircle,
  Circle
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  liked?: boolean;
  applied?: boolean;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  timeline: Array<{
    step: string;
    completed: boolean;
    date?: string;
  }>;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Desarrollador Frontend Senior',
    company: 'TechCorp Colombia',
    location: 'Bogotá, Colombia',
    salary: '$4.000.000 - $6.000.000 COP',
    type: 'Tiempo completo',
    description: 'Buscamos un desarrollador frontend con experiencia en React y TypeScript para unirse a nuestro equipo de innovación.',
    requirements: ['3+ años experiencia React', 'TypeScript', 'Git', 'Metodologías ágiles'],
    benefits: ['Trabajo remoto', 'Seguro médico', 'Bonos por desempeño', '15 días de vacaciones']
  },
  {
    id: '2',
    title: 'Diseñador UX/UI',
    company: 'CreativeStudio',
    location: 'Medellín, Colombia',
    salary: '$3.500.000 - $5.000.000 COP',
    type: 'Medio tiempo',
    description: 'Únete a nuestro equipo creativo para diseñar experiencias digitales innovadoras.',
    requirements: ['Figma avanzado', 'Portafolio sólido', 'Design thinking', 'Prototipado'],
    benefits: ['Horarios flexibles', 'Capacitaciones', 'Ambiente creativo']
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Desarrollador Frontend Senior',
    company: 'TechCorp Colombia',
    appliedDate: '2024-01-15',
    status: 'interview',
    timeline: [
      { step: 'Aplicación enviada', completed: true, date: '2024-01-15' },
      { step: 'CV revisado', completed: true, date: '2024-01-18' },
      { step: 'Entrevista técnica', completed: true, date: '2024-01-22' },
      { step: 'Entrevista final', completed: false },
      { step: 'Decisión final', completed: false }
    ]
  }
];

export function SitBaxApp() {
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'welcome' | 'app'>('loading');
  const [activeTab, setActiveTab] = useState<'matching' | 'chat' | 'explore' | 'applications' | 'profile'>('matching');
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Loading screen effect
  useEffect(() => {
    if (currentScreen === 'loading') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-sky-300 to-sky-200">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Animated Swallow */}
        <motion.div
          animate={{ 
            y: [-10, 10, -10],
            rotate: [-2, 2, -2]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 via-yellow-200 to-red-300 flex items-center justify-center"
        >
          <motion.div
            animate={{ scaleX: [1, 0.8, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-white text-2xl"
          >
            🐦
          </motion.div>
        </motion.div>
        <div className="text-blue-900 text-xl">SitBax</div>
        <div className="text-blue-700 text-sm">Conectando talentos</div>
      </motion.div>
    </div>
  );

  // Welcome Screen Component
  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-sky-300 to-sky-200 px-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 via-yellow-200 to-red-300 flex items-center justify-center">
          <span className="text-white text-2xl">🐦</span>
        </div>
        <h1 className="text-3xl text-blue-900 mb-2">SitBax</h1>
        <p className="text-blue-700">Encuentra tu próxima oportunidad</p>
      </div>

      {/* Propósitos Colombia Logo */}
      <div className="mb-8">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1675855545155-6daf62c98ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGZsYWclMjBsb2dvfGVufDF8fHx8MTc1NjA5NzM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Propósitos Colombia"
          className="w-24 h-16 object-cover rounded-lg"
        />
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-5">
        <Button
          onClick={() => {
            setIsLoggedIn(true);
            setCurrentScreen('app');
          }}
          className="w-full h-14 bg-white border-2 border-blue-800 text-yellow-200 hover:bg-blue-50 rounded-lg"
          style={{ fontSize: '18px' }}
        >
          Crear cuenta
        </Button>
        
        <Button
          onClick={() => {
            setIsLoggedIn(true);
            setCurrentScreen('app');
          }}
          className="w-full h-14 bg-white border-2 border-blue-800 text-yellow-200 hover:bg-blue-50 rounded-lg"
          style={{ fontSize: '18px' }}
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  );

  // Job Card Component
  const JobCard = ({ job, onLike, onPass }: { job: Job; onLike: () => void; onPass: () => void }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative"
    >
      <Card className="w-full h-96 bg-gray-800 text-white p-6 rounded-3xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl mb-2">{job.title}</h3>
            <div className="flex items-center text-gray-300 mb-2">
              <Building2 className="w-4 h-4 mr-2" />
              {job.company}
            </div>
            <div className="flex items-center text-gray-300 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-green-400 mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              {job.salary}
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-600 text-white">
            {job.type}
          </Badge>
        </div>
        
        <p className="text-gray-300 text-sm mb-6 line-clamp-4">
          {job.description}
        </p>
        
        <div className="absolute bottom-6 left-6 right-6 flex justify-center space-x-6">
          <Button
            onClick={onPass}
            size="lg"
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white border-0"
          >
            <X className="w-6 h-6" />
          </Button>
          <Button
            onClick={() => setSelectedJob(job)}
            size="lg"
            className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white border-0"
          >
            <Eye className="w-6 h-6" />
          </Button>
          <Button
            onClick={onLike}
            size="lg"
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white border-0"
          >
            <Heart className={`w-6 h-6 ${job.liked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  // Job Detail Modal
  const JobDetailModal = ({ job, onClose, onApply }: { job: Job; onClose: () => void; onApply: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button onClick={onClose} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="w-5 h-5" />
            </Button>
          </div>

          {/* Job Info */}
          <div className="mb-6">
            <h2 className="text-2xl mb-2">{job.title}</h2>
            <div className="flex items-center text-gray-600 mb-2">
              <Building2 className="w-4 h-4 mr-2" />
              {job.company}
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-green-600 mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              {job.salary}
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {job.type}
            </Badge>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Descripción</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Requisitos</h3>
            <ul className="space-y-1">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-lg mb-2">Beneficios</h3>
            <ul className="space-y-1">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Apply Button */}
          <Button onClick={onApply} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Aplicar ahora
          </Button>
        </div>
      </motion.div>
    </div>
  );

  // Application Detail Modal
  const ApplicationDetailModal = ({ application, onClose }: { application: Application; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button onClick={onClose} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg">Detalles de Aplicación</h2>
            <div className="w-8"></div>
          </div>

          {/* Application Info */}
          <div className="mb-6">
            <h3 className="text-xl mb-2">{application.jobTitle}</h3>
            <p className="text-gray-600 mb-2">{application.company}</p>
            <p className="text-sm text-gray-500">Aplicado el {application.appliedDate}</p>
            <Badge className={`mt-2 ${
              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
              application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {application.status === 'pending' ? 'Pendiente' :
               application.status === 'reviewed' ? 'Revisado' :
               application.status === 'interview' ? 'Entrevista' :
               application.status === 'rejected' ? 'Rechazado' :
               'Aceptado'}
            </Badge>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3 className="text-lg mb-4">Proceso de Selección</h3>
            <div className="space-y-4">
              {application.timeline.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.step}
                    </p>
                    {step.date && (
                      <p className="text-sm text-gray-500">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Main App Content
  const AppContent = () => {
    const handleLike = () => {
      const updatedJobs = [...jobs];
      updatedJobs[currentJobIndex].liked = true;
      setJobs(updatedJobs);
      setCurrentJobIndex((prev) => (prev + 1) % jobs.length);
    };

    const handlePass = () => {
      setCurrentJobIndex((prev) => (prev + 1) % jobs.length);
    };

    const handleApply = () => {
      if (selectedJob) {
        const updatedJobs = jobs.map(job => 
          job.id === selectedJob.id ? { ...job, applied: true } : job
        );
        setJobs(updatedJobs);
        setSelectedJob(null);
        setActiveTab('applications');
      }
    };

    return (
      <div className="h-full bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-yellow-200 to-red-300 flex items-center justify-center mr-3">
              <span className="text-white text-sm">🐦</span>
            </div>
            <span className="text-lg">SitBax</span>
          </div>
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1675855545155-6daf62c98ffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYSUyMGZsYWclMjBsb2dvfGVufDF8fHx8MTc1NjA5NzM3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Propósitos Colombia"
            className="w-8 h-6 object-cover rounded"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'matching' && (
            <div className="h-full flex items-center justify-center p-6">
              <JobCard 
                job={jobs[currentJobIndex]} 
                onLike={handleLike}
                onPass={handlePass}
              />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="p-4 h-full">
              <h2 className="text-xl mb-4">Matches</h2>
              <div className="space-y-3">
                {jobs.filter(job => job.liked).map(job => (
                  <Card key={job.id} className="p-4 bg-gray-800 border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white">{job.company}</h3>
                        <p className="text-gray-400 text-sm">{job.title}</p>
                      </div>
                      <Heart className="w-5 h-5 text-red-500 fill-current" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="p-4 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Explorar Empleos</h2>
                <Button size="sm" variant="ghost">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {jobs.map(job => (
                  <Card key={job.id} className="p-4 bg-gray-800 border-gray-700 cursor-pointer"
                        onClick={() => setSelectedJob(job)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">{job.title}</h3>
                        <p className="text-gray-400 text-sm">{job.company}</p>
                        <p className="text-gray-500 text-xs">{job.location}</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
                        {job.type}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="p-4 h-full">
              <h2 className="text-xl mb-4">Mis Postulaciones</h2>
              <div className="space-y-3">
                {mockApplications.map(app => (
                  <Card key={app.id} className="p-4 bg-gray-800 border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">{app.jobTitle}</h3>
                        <p className="text-gray-400 text-sm">{app.company}</p>
                        <p className="text-gray-500 text-xs">Aplicado el {app.appliedDate}</p>
                      </div>
                      <Badge className={`${
                        app.status === 'accepted' ? 'bg-green-600' :
                        app.status === 'rejected' ? 'bg-red-600' :
                        app.status === 'interview' ? 'bg-blue-600' :
                        'bg-yellow-600'
                      } text-white text-xs`}>
                        {app.status === 'pending' ? 'Pendiente' :
                         app.status === 'reviewed' ? 'Revisado' :
                         app.status === 'interview' ? 'Entrevista' :
                         app.status === 'rejected' ? 'Rechazado' :
                         'Aceptado'}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-blue-400 p-0 h-auto"
                      onClick={() => setSelectedApplication(app)}
                    >
                      Ver detalles
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-4 h-full">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl mb-1">Juan Pérez</h2>
                <p className="text-gray-400">Desarrollador Frontend</p>
                <p className="text-gray-500 text-sm">Bogotá, Colombia</p>
              </div>
              
              <div className="space-y-4">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white mb-2">Experiencia</h3>
                  <p className="text-gray-400 text-sm">5 años en desarrollo web</p>
                </Card>
                
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-white mb-2">Habilidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Node.js', 'Python'].map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-blue-600 text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-blue-200 p-2">
          <div className="flex justify-around">
            {[
              { key: 'matching', icon: Heart, label: 'Matching' },
              { key: 'chat', icon: MessageCircle, label: 'Chat' },
              { key: 'explore', icon: Search, label: 'Explorar' },
              { key: 'applications', icon: Briefcase, label: 'Postulaciones' },
              { key: 'profile', icon: User, label: 'Perfil' }
            ].map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                onClick={() => setActiveTab(key as any)}
                variant="ghost"
                className={`flex flex-col items-center p-2 h-auto ${
                  activeTab === key ? 'text-blue-800' : 'text-blue-600'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Modals */}
        {selectedJob && (
          <JobDetailModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)}
            onApply={handleApply}
          />
        )}
        {selectedApplication && (
          <ApplicationDetailModal 
            application={selectedApplication} 
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </div>
    );
  };

  // Render based on current screen
  if (currentScreen === 'loading') return <LoadingScreen />;
  if (currentScreen === 'welcome') return <WelcomeScreen />;
  return <AppContent />;
}