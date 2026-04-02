import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage, Text, Rect, Group } from 'react-konva'
import useImage from 'use-image'
import { Save, ChevronLeft, Image as ImageIcon, MessageSquare, Calendar as CalendarIcon, Wand2, Download, FileText, ImageIcon as ImageGenericIcon, MessageCircle, Instagram, Facebook, Twitter, Share2 } from 'lucide-react'
import { jsPDF } from 'jspdf'

const CanvasPreview = ({ imageUrl, message, name, stageRef }) => {
  // Ensure we use Anonymous crossOrigin to prevent tainted canvas
  const [image] = useImage(imageUrl || 'https://via.placeholder.com/800x600/6366f1/ffffff?text=Choose+Image', 'Anonymous')

  return (
    <div className="glass" style={{ borderRadius: 'var(--radius)', overflow: 'hidden', width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000' }}>
      <Stage width={600} height={400} ref={stageRef}>
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={600}
              height={400}
              name="background"
            />
          )}
          {/* Overlay Gradient Background */}
          <Rect
            x={0}
            y={280}
            width={600}
            height={120}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: 120 }}
            fillLinearGradientColorStops={[0, 'rgba(0,0,0,0)', 1, 'rgba(0,0,0,0.8)']}
          />
          {/* Festival Name */}
          <Text
            text={name || 'Festival Name'}
            fontSize={36}
            fontStyle="bold"
            fill="white"
            x={30}
            y={300}
            fontFamily="'Inter', sans-serif"
          />
          {/* Message */}
          <Text
            text={message || 'Your greeting message here...'}
            fontSize={18}
            fill="#e2e8f0"
            x={30}
            y={345}
            width={540}
            wrap="word"
            fontFamily="'Inter', sans-serif"
            lineHeight={1.4}
          />
        </Layer>
      </Stage>
    </div>
  )
}

export default function FestivalEditor({ festival, onSave, onCancel }) {
  const [formData, setFormData] = useState(festival || {
    name: '',
    date: '',
    message: '',
    image_url: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800',
    is_active: true
  })

  // Suggested backgrounds
  const suggestions = [
    'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1510519133418-2410313f3241?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1579294800821-694d9302674e?auto=format&fit=crop&q=80&w=800'
  ]

  const stageRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleDownloadPNG = () => {
    if (stageRef.current) {
      try {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 }) // High quality
        const link = document.createElement('a')
        link.download = `${formData.name || 'festival'}-greeting.png`
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (err) {
        alert("Download failed: Image provider might be blocking access (CORS). Try a different image.")
        console.error(err)
      }
    }
  }

  const handleDownloadPDF = () => {
    if (stageRef.current) {
      try {
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
        const pdf = new jsPDF('landscape', 'px', [600, 400])
        pdf.addImage(uri, 'PNG', 0, 0, 600, 400)
        pdf.save(`${formData.name || 'festival'}-greeting.pdf`)
      } catch (err) {
        alert("PDF export failed: Image provider might be blocking access (CORS). Try a different image.")
        console.error(err)
      }
    }
  }

  const generateAImessage = () => {
    const messages = [
      `Wishing everyone a wonderful ${formData.name || 'festival'}! May your day be filled with joy.`,
      `Happy ${formData.name || 'festival'} to our amazing team! Wishing you peace and prosperity.`,
      `Sending warm wishes on ${formData.name || 'festival'}. Let's celebrate together!`
    ]
    const random = Math.floor(Math.random() * messages.length)
    setFormData(prev => ({ ...prev, message: messages[random] }))
  }

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" style={{ background: 'transparent', padding: '0.5rem' }} onClick={onCancel}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.75rem' }}>{festival ? 'Edit Festival' : 'Create New Festival'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" style={{ background: '#f8fafc', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={handleDownloadPNG}>
            <ImageGenericIcon size={18} />
            PNG
          </button>
          <button className="btn" style={{ background: '#f8fafc', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={handleDownloadPDF}>
            <FileText size={18} />
            PDF
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Editor Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <CalendarIcon size={14} /> Festival Name & Date
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Diwali"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={14} /> Greeting Message
                </div>
                <button 
                  onClick={generateAImessage}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}
                >
                  <Wand2 size={12} /> AI Generate
                </button>
              </label>
              <textarea
                name="message"
                placeholder="Share your wishes..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', resize: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <ImageIcon size={14} /> Image URL
              </label>
              <input
                type="text"
                name="image_url"
                placeholder="https://images.unsplash.com..."
                value={formData.image_url}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', marginBottom: '1rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {suggestions.map((url, i) => (
                  <img 
                    key={i} 
                    src={url} 
                    onClick={() => setFormData(prev => ({ ...prev, image_url: url }))}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: formData.image_url === url ? '2px solid var(--primary)' : '2px solid transparent' }} 
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input 
                type="checkbox" 
                name="is_active" 
                id="is_active" 
                checked={formData.is_active} 
                onChange={handleChange} 
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="is_active" style={{ fontSize: '0.875rem' }}>Enable auto-wish for this festival</label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave(formData)}>
              <Save size={18} />
              Save Festival
            </button>
            <button className="btn" style={{ background: 'var(--border)', color: 'var(--text-main)' }} onClick={onCancel}>
              Cancel
            </button>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Share Platform</p>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div style={{ cursor: 'pointer', padding: '0.75rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '12px' }} title="WhatsApp">
                <MessageCircle size={20} />
              </div>
              <div style={{ cursor: 'pointer', padding: '0.75rem', background: '#fdf2f8', color: '#db2777', borderRadius: '12px' }} title="Instagram">
                <Instagram size={20} />
              </div>
              <div style={{ cursor: 'pointer', padding: '0.75rem', background: '#eff6ff', color: '#2563eb', borderRadius: '12px' }} title="Facebook">
                <Facebook size={20} />
              </div>
              <div style={{ cursor: 'pointer', padding: '0.75rem', background: '#f8fafc', color: '#0f172a', borderRadius: '12px' }} title="X (Twitter)">
                <Twitter size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>Greeting Card Preview</label>
          <CanvasPreview 
            imageUrl={formData.image_url} 
            message={formData.message} 
            name={formData.name} 
            stageRef={stageRef}
          />
          <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--radius)', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <p><strong>Note:</strong> This preview uses <code>react-konva</code> to simulate findings. You can now download as **PNG** or **PDF**.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
