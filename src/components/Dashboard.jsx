import { Calendar, Plus, Trash2, Edit3, Send, CheckCircle2, XCircle } from 'lucide-react'

export default function Dashboard({ festivals, loading, onEdit, onDelete, onToggleActive }) {
  const today = new Date().toISOString().split('T')[0]
  const todayFestival = festivals.find(f => f.date === today)

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Fetching festivals from Supabase...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Festival Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage office celebrations and automated greetings.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onEdit(null)}>
          <Plus size={18} />
          Add Festival
        </button>
      </header>

      {todayFestival && (
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '3rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Today's Celebration</span>
              <h2 style={{ fontSize: '1.75rem', margin: '0.75rem 0' }}>{todayFestival.name} 🎊</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>"{todayFestival.message}"</p>
              <button className="btn btn-primary" style={{ background: '#10b981' }}>
                <Send size={18} />
                Send Manual Greeting
              </button>
            </div>
            <div style={{ width: '300px', height: '180px', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              <img src={todayFestival.image_url} alt={todayFestival.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {festivals.map(fest => (
          <div key={fest.id} className="card" style={{ position: 'relative' }}>
            <div style={{ height: '160px', margin: '-1.5rem -1.5rem 1.5rem -1.5rem', overflow: 'hidden', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
              <img src={fest.image_url} alt={fest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>{fest.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  <Calendar size={14} />
                  {new Date(fest.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div 
                style={{ cursor: 'pointer' }} 
                onClick={() => onToggleActive(fest.id)}
                title={fest.is_active ? 'Active' : 'Inactive'}
              >
                {fest.is_active ? <CheckCircle2 color="#10b981" /> : <XCircle color="#94a3b8" />}
              </div>
            </div>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {fest.message}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <button className="btn" style={{ flex: 1, background: '#f1f5f9', color: '#475569' }} onClick={() => onEdit(fest)}>
                <Edit3 size={16} />
                Edit
              </button>
              <button className="btn" style={{ background: '#fef2f2', color: '#dc2626' }} onClick={() => onDelete(fest.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
