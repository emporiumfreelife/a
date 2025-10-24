import { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  CheckCircle,
  MessageSquare,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Eye,
  Award,
  Bell,
  FileText,
  BarChart2,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HiredProject {
  id: string;
  title: string;
  description: string;
  status: string;
  budget_amount: number;
  created_at: string;
  due_date: string;
  client: {
    full_name: string;
    profile_image?: string;
  };
  milestones?: Array<{
    title: string;
    status: string;
    due_date: string;
  }>;
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<HiredProject[]>([]);
  const [activeView, setActiveView] = useState<'hired' | 'completed' | 'all'>('hired');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);

    const mockProjects: HiredProject[] = [
      {
        id: '1',
        title: 'Brand Identity Design',
        description: 'Complete brand identity package including logo, colors, and guidelines',
        status: 'in_progress',
        budget_amount: 2500000,
        created_at: '2025-01-15',
        due_date: '2025-02-15',
        client: {
          full_name: 'John Doe',
          profile_image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
        },
        milestones: [
          { title: 'Initial concepts', status: 'completed', due_date: '2025-01-20' },
          { title: 'Revisions', status: 'in_progress', due_date: '2025-02-01' },
          { title: 'Final delivery', status: 'pending', due_date: '2025-02-15' }
        ]
      },
      {
        id: '2',
        title: 'Product Photography Session',
        description: 'Professional photography for e-commerce catalog',
        status: 'in_progress',
        budget_amount: 1200000,
        created_at: '2025-01-22',
        due_date: '2025-02-05',
        client: {
          full_name: 'Sarah Smith'
        },
        milestones: [
          { title: 'Studio setup', status: 'completed', due_date: '2025-01-25' },
          { title: 'Photo shoot', status: 'in_progress', due_date: '2025-01-30' }
        ]
      },
      {
        id: '3',
        title: 'Social Media Content Package',
        description: '30 days of social media content creation',
        status: 'completed',
        budget_amount: 850000,
        created_at: '2024-12-15',
        due_date: '2025-01-15',
        client: {
          full_name: 'Mike Johnson'
        }
      }
    ];

    setProjects(mockProjects);
    setLoading(false);
  };

  const filteredProjects = projects.filter(p => {
    if (activeView === 'hired') return p.status === 'in_progress';
    if (activeView === 'completed') return p.status === 'completed';
    return true;
  });

  const stats = {
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalEarnings: projects.reduce((sum, p) => sum + p.budget_amount, 0),
    avgRating: 4.8
  };

  const analytics = {
    profileViews: 1247,
    inquiries: 34,
    conversionRate: 68
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-rose-500/10 to-purple-600/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Creator Dashboard</h2>
            <p className="text-gray-300">Manage your hired projects and track your performance</p>
          </div>
          <Bell className="w-8 h-8 text-rose-400" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.activeProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold text-white mt-1">UGX {(stats.totalEarnings / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Rating</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.avgRating}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.completedProjects}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Performance Analytics</h3>
          <BarChart2 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Eye className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analytics.profileViews.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Profile Views (30d)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analytics.inquiries}</p>
              <p className="text-sm text-gray-400">Project Inquiries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analytics.conversionRate}%</p>
              <p className="text-sm text-gray-400">Conversion Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2 glass-effect p-2 rounded-xl w-fit">
        <button
          onClick={() => setActiveView('hired')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeView === 'hired'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          Active Hired
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
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  {project.status === 'in_progress' && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
              {project.client.profile_image ? (
                <img
                  src={project.client.profile_image}
                  alt={project.client.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {project.client.full_name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{project.client.full_name}</p>
                <p className="text-gray-400 text-xs">Client</p>
              </div>
              <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>

            {/* Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-gray-400">Milestones</p>
                {project.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      milestone.status === 'completed' ? 'bg-green-500' :
                      milestone.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <span className={`flex-1 ${
                      milestone.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-300'
                    }`}>
                      {milestone.title}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(milestone.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Project Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-green-400">UGX {(project.budget_amount / 1000).toLocaleString()}k</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Due {new Date(project.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Update Progress
              </button>
              <button className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg transition-all">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Client Demographics & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Services</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Brand Design</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-gradient-to-r from-rose-500 to-purple-600" />
                </div>
                <span className="text-sm text-gray-400">80%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Photography</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-3/5 h-full bg-gradient-to-r from-blue-500 to-cyan-600" />
                </div>
                <span className="text-sm text-gray-400">60%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Content Creation</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="w-2/5 h-full bg-gradient-to-r from-green-500 to-emerald-600" />
                </div>
                <span className="text-sm text-gray-400">40%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">by John Doe</span>
              </div>
              <p className="text-sm text-gray-300">Excellent work and great communication throughout the project!</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <Star className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm text-gray-400">by Sarah Smith</span>
              </div>
              <p className="text-sm text-gray-300">Professional and delivered on time. Highly recommend!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="glass-effect rounded-2xl p-12 text-center border border-white/10">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Start applying to projects to build your portfolio</p>
          <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all">
            Browse Available Projects
          </button>
        </div>
      )}
    </div>
  );
}
