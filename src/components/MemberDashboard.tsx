import { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle,
  MessageSquare,
  DollarSign,
  Star,
  Plus,
  TrendingUp,
  FileText,
  Download,
  Mail,
  Share2,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_amount: number;
  created_at: string;
  due_date: string;
  provider?: {
    full_name: string;
    profile_image?: string;
  };
  progress: number;
}

export default function MemberDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeView, setActiveView] = useState<'active' | 'completed' | 'all'>('active');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);

    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'Brand Identity Design',
        description: 'Complete brand identity package including logo, colors, and guidelines',
        status: 'in_progress',
        budget_amount: 2500000,
        created_at: '2025-01-15',
        due_date: '2025-02-15',
        progress: 65,
        provider: {
          full_name: 'Emma Wilson',
          profile_image: 'https://images.pexels.com/photos/31422830/pexels-photo-31422830.png?auto=compress&cs=tinysrgb&w=150'
        }
      },
      {
        id: '2',
        title: 'Social Media Campaign',
        description: 'Three-month social media marketing campaign',
        status: 'in_progress',
        budget_amount: 1800000,
        created_at: '2025-01-20',
        due_date: '2025-04-20',
        progress: 35,
        provider: {
          full_name: 'Ruby Nesda',
          profile_image: 'https://images.pexels.com/photos/6311651/pexels-photo-6311651.jpeg?auto=compress&cs=tinysrgb&w=150'
        }
      },
      {
        id: '3',
        title: 'Product Photography',
        description: 'Professional photography for product catalog',
        status: 'completed',
        budget_amount: 950000,
        created_at: '2024-12-10',
        due_date: '2024-12-28',
        progress: 100,
        provider: {
          full_name: 'Maya Chen'
        }
      }
    ];

    setProjects(mockProjects);
    setLoading(false);
  };

  const filteredProjects = projects.filter(p => {
    if (activeView === 'active') return p.status === 'in_progress';
    if (activeView === 'completed') return p.status === 'completed';
    return true;
  });

  const stats = {
    active: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalSpent: projects.reduce((sum, p) => sum + p.budget_amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-gray-300">Manage your projects, track progress, and communicate with your team.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Investment</p>
              <p className="text-3xl font-bold text-white mt-1">UGX {(stats.totalSpent / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-600/20 border border-rose-500/30 hover:border-rose-500/50 transition-all group">
            <Plus className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">New Project</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-all group">
            <MessageSquare className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">Messages</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 hover:border-green-500/50 transition-all group">
            <FileText className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">Receipts</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-all group">
            <Star className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-white">Leave Review</span>
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2 glass-effect p-2 rounded-xl w-fit">
        <button
          onClick={() => setActiveView('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeView === 'active'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveView('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeView === 'completed'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveView('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeView === 'all'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          All Projects
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="glass-effect rounded-2xl p-6 border border-white/10 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'completed'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                {project.status === 'in_progress' ? 'In Progress' : 'Completed'}
              </span>
            </div>

            {/* Provider Info */}
            {project.provider && (
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5">
                {project.provider.profile_image ? (
                  <img
                    src={project.provider.profile_image}
                    alt={project.provider.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {project.provider.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{project.provider.full_name}</p>
                  <p className="text-gray-400 text-xs">Service Provider</p>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-medium text-white">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-rose-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span>UGX {(project.budget_amount / 1000).toLocaleString()}k</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Due {new Date(project.due_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recommended for You</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400 font-medium mb-2">Similar Projects</p>
            <p className="text-gray-300 text-sm">Based on your past work, consider these opportunities</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <p className="text-sm text-green-400 font-medium mb-2">Top Rated Talent</p>
            <p className="text-gray-300 text-sm">Work with highly rated professionals in your category</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20">
            <p className="text-sm text-orange-400 font-medium mb-2">Upgrade Benefits</p>
            <p className="text-gray-300 text-sm">Premium members get priority support and more</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="glass-effect rounded-2xl p-12 text-center border border-white/10">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">Start your first project and bring your vision to life</p>
          <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
            Start New Project
          </button>
        </div>
      )}
    </div>
  );
}
