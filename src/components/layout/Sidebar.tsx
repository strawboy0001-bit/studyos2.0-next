import Link from "next/link";
import { 
  Home, 
  BookOpen, 
  Files, 
  Edit3, 
  Layers, 
  CheckSquare, 
  Calendar, 
  Target, 
  Settings,
  HelpCircle
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Study Materials', href: '/materials', icon: Files },
  { name: 'Notes', href: '/notes', icon: Edit3 },
  { name: 'Flashcards', href: '/flashcards', icon: Layers },
  { name: 'Quizzes', href: '/quizzes', icon: HelpCircle },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Planner', href: '/planner', icon: Calendar },
  { name: 'Goals', href: '/goals', icon: Target },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full w-full flex-col bg-transparent">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-2xl font-black text-blue-500 tracking-tight font-sans">StudyOS<span className="text-blue-300">.</span></h1>
      </div>
      <nav className="flex flex-1 flex-col px-4 pb-4 overflow-y-auto">
        <div className="space-y-1 mt-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-900/60 hover:bg-blue-100/50 hover:text-blue-600 transition-all"
            >
              <item.icon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-4 space-y-1">
          <Link
            href="/settings"
            onClick={onNavigate}
            className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-900/60 hover:bg-blue-100/50 hover:text-blue-600 transition-all"
          >
            <Settings className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
            Settings
          </Link>
        </div>
      </nav>
    </div>
  );
}
