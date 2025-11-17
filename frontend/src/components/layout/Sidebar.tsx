import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  UserCircle,
  Target,
  Mail,
  Info,
  Calendar,
  Edit3,
  RotateCcw,
  Star,
  ChevronRight,
  ShoppingCart,
  Users,
  GraduationCap,
  Settings,
  PieChart,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const studentNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/enrollments', label: 'My Enrollments', icon: FileText },
    { path: '/cart', label: 'Shopping Cart', icon: ShoppingCart },
    { path: '/academic/grades', label: 'My Grades', icon: BarChart3 },
    { path: '/academic/transcript', label: 'Transcript', icon: FileText },
    { path: '/planning', label: 'Degree Planning', icon: Target },
    { path: '/personal', label: 'Personal Info', icon: UserCircle },
    { separator: true, label: 'Services' },
    { path: '/academic-calendar', label: 'Academic Calendar', icon: Calendar },
    { path: '/add-drop', label: 'Add/Drop Courses', icon: Edit3 },
    { path: '/major-change', label: 'Major Change', icon: RotateCcw },
    { path: '/evaluations', label: 'Course Evaluations', icon: Star },
    { path: '/applications', label: 'Applications', icon: Mail },
    { path: '/campus', label: 'Campus Info', icon: Info },
  ];

  const facultyNavItems = [
    { path: '/faculty', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { path: '/faculty/courses', label: 'My Courses', icon: BookOpen },
    { path: '/campus', label: 'Campus Info', icon: Info },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { separator: true, label: 'Management' },
    { path: '/admin/users', label: 'User Management', icon: Users },
    { path: '/admin/courses', label: 'Course Management', icon: BookOpen },
    { path: '/admin/programs', label: 'Program Management', icon: GraduationCap },
    { path: '/admin/enrollments', label: 'Enrollment Management', icon: FileText },
    { separator: true, label: 'Analytics & Reports' },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: PieChart },
    { separator: true, label: 'Applications' },
    { path: '/admin/applications', label: 'Review Applications', icon: Mail },
    { separator: true, label: 'System' },
    { path: '/campus', label: 'Campus Info', icon: Info },
  ];

  const getNavItems = () => {
    if (user?.role === 'INSTRUCTOR') return facultyNavItems;
    if (user?.role === 'ADMINISTRATOR') return adminNavItems;
    return studentNavItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64',
          'bg-card border-r border-border',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item, index) => {
              if ('separator' in item && item.separator) {
                return (
                  <div key={index} className="pt-4 pb-2">
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </h3>
                  </div>
                );
              }

              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
                    'transition-all duration-200 group',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer info */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Current Term</p>
              <p>Fall 2024</p>
              <p className="mt-2">Total Credits: 12</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
