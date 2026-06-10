import { Outlet } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Sidebar } from '../components/layout/Sidebar'
import { Navbar } from '../components/layout/Navbar'
import { useSidebar } from '../hooks/useSidebar'

export function DashboardLayout() {
  const { collapsed, mobileOpen, toggle, toggleMobile, closeMobile } = useSidebar()

  return (
    <div className="min-h-screen bg-tenant-bg font-sans text-tenant-text">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
      />
      <Navbar
        onMenuToggle={toggleMobile}
        sidebarCollapsed={collapsed}
      />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          // Desktop offset según sidebar
          collapsed ? 'lg:pl-16' : 'lg:pl-64',
        )}
      >
        <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
