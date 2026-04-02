import { useState, useEffect } from 'react'
import { Calendar, Bell, Settings, LogOut, Search, User, Filter } from 'lucide-react'
import { supabase } from './lib/supabase'
import Dashboard from './components/Dashboard'
import FestivalEditor from './components/FestivalEditor'

function App() {
  const [view, setView] = useState('home') // 'home' or 'editor'
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingFestival, setEditingFestival] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFestivals()
  }, [])

  const fetchFestivals = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('festivals')
      .select('*')
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Error fetching festivals:', error)
    } else {
      setFestivals(data || [])
    }
    setLoading(false)
  }

  const handleEdit = (festival) => {
    setEditingFestival(festival)
    setView('editor')
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this festival?')) {
      const { error } = await supabase.from('festivals').delete().eq('id', id)
      if (error) console.error('Error deleting:', error)
      else setFestivals(prev => prev.filter(f => f.id !== id))
    }
  }

  const handleToggleActive = async (id) => {
    const fest = festivals.find(f => f.id === id)
    const { error } = await supabase
      .from('festivals')
      .update({ is_active: !fest.is_active })
      .eq('id', id)
    
    if (error) console.error('Error toggling status:', error)
    else setFestivals(prev => prev.map(f => f.id === id ? { ...f, is_active: !f.is_active } : f))
  }

  const handleSave = async (festivalData) => {
    // Explicitly select only the fields we want to save to the database
    const payload = {
      name: festivalData.name,
      date: festivalData.date,
      message: festivalData.message,
      image_url: festivalData.image_url,
      is_active: festivalData.is_active
    }

    if (editingFestival) {
      // Update
      const { error } = await supabase
        .from('festivals')
        .update(payload)
        .eq('id', editingFestival.id)
      
      if (error) {
        console.error('Error updating:', error)
        alert(`Update failed: ${error.message}`)
        return
      }
    } else {
      // Create
      const { error } = await supabase
        .from('festivals')
        .insert([payload])
      
      if (error) {
        console.error('Error creating:', error)
        alert(`Insert failed: ${error.message}. Ensure your table name is "festivals" (plural).`)
        return
      }
    }
    
    fetchFestivals()
    setView('home')
    setEditingFestival(null)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredFestivals = festivals.filter(f => 
    f.name.toLowerCase().includes(searchQuery) || 
    f.message.toLowerCase().includes(searchQuery)
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', padding: '2rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', position: 'sticky', top: 0, height: '100vh', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
            <Calendar size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>FestivaAuto</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button 
            className={`btn ${view === 'home' ? 'btn-primary' : ''}`} 
            style={{ justifyContent: 'flex-start', background: view === 'home' ? 'var(--primary)' : 'transparent', color: view === 'home' ? 'white' : 'var(--text-muted)' }}
            onClick={() => setView('home')}
          >
            <Calendar size={18} />
            Dashboard
          </button>
          <button className="btn" style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-muted)' }}>
            <Bell size={18} />
            Email Logs
          </button>
          <button className="btn" style={{ justifyContent: 'flex-start', background: 'transparent', color: 'var(--text-muted)' }}>
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>Office Admin</p>
              <p>admin@office.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search festivals..." 
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-card)', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Filter size={18} />
              Filter
            </button>
            <div style={{ width: '1px', height: '36px', background: 'var(--border)' }}></div>
            <button className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {view === 'home' ? (
          <Dashboard 
            festivals={filteredFestivals} 
            loading={loading}
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        ) : (
          <FestivalEditor 
            festival={editingFestival} 
            onSave={handleSave} 
            onCancel={() => setView('home')} 
          />
        )}
      </main>
    </div>
  )
}

export default App
