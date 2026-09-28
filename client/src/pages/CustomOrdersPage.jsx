import { Link } from 'react-router-dom'
import { ORDER_FORM_URL } from '../utils/api'

const GemDivider = () => (
  <div className="gem-divider"><div className="gem" /></div>
)

const SERVICES = [
  { num: '01', title: 'Ring Restoration', desc: 'Breathe new life into a treasured ring. We repair, resize, re-stone, and refinish with expert precision.' },
  { num: '02', title: 'Masonic Rings', desc: 'Precision-crafted Masonic rings with meaningful symbols rendered in gold or silver — built to last generations.' },
  { num: '03', title: 'College Rings', desc: 'Celebrate academic milestones with a custom class ring that captures your achievement forever.' },
  { num: '04', title: 'Wedding Rings', desc: 'Your love story deserves a ring as unique as your journey — beautifully handcrafted, just for you.' },
]

export default function CustomOrdersPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container page-hero-content">
          <div className="overline animate-in">Bespoke</div>
          <h1 className="section-title animate-in" style={{ marginBottom: 0 }}>
            Custom <em>Orders</em>
          </h1>
          <div className="gem-divider animate-in" style={{ maxWidth: 200, margin: '16px auto' }}>
            <div className="gem" />
          </div>
          <p className="section-sub animate-in" style={{ margin: '0 auto' }}>
            Your vision, our craft. We create bespoke jewelry tailored to your story,
            made with the finest materials and attention to detail.
          </p>
          <div style={{ marginTop: 24 }} className="animate-in">
            <a
              href={ORDER_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Fill Out Custom Order Form
            </a>
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="inner-section">
        <div className="container">
          <div className="section-head animate-in">
            <div className="overline">What We Create</div>
            <h2 className="section-title">
              Our <em>Specialties</em>
            </h2>
            <GemDivider />
          </div>

          <div className="how-it-works">
            {SERVICES.map(s => (
              <div key={s.num} className="step-card animate-in">
                <div className="step-num">{s.num}</div>
                <div className="service-title" style={{ marginBottom: 8 }}>{s.title}</div>
                <div className="step-text">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process + CTA */}
      <section className="custom-section">
        <div className="container">
          <div className="custom-grid">
            <div className="animate-in">
              <div className="overline">How It Works</div>
              <h2 className="custom-left-title">
                <span className="line-ivory">Simple, personal</span><br />
                <span className="line-gold">service</span>
              </h2>
              <div className="custom-rule" />
              <p className="custom-body">
                We keep the process simple so you can focus on the vision.
                Our team walks you through every step, ensuring the final piece
                is exactly what you imagined — or even better.
              </p>

              <div className="timeline" style={{ marginBottom: 32 }}>
                {[
                  'Click Order Now on any product or use our Order Form',
                  'Fill in your details and describe your design',
                  'We contact you via Viber or Messenger to refine details',
                  'Arrange payment via GCash, PayMaya, or Bank Transfer',
                  'We handcraft and ship directly to you',
                ].map((step, i, arr) => (
                  <div key={i} className="timeline-step">
                    <div className="timeline-left">
                      <div
                        className="timeline-circle"
                        style={{ borderColor: 'var(--gold)', color: 'var(--gold)', background: 'rgba(201,168,76,0.1)' }}
                      >
                        {i + 1}
                      </div>
                      {i < arr.length - 1 && <div className="timeline-connector" />}
                    </div>
                    <div className="timeline-text" style={{ color: 'var(--ivory-muted)', paddingBottom: 22 }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={ORDER_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex' }}
              >
                Start Custom Order
              </a>
            </div>

            <div className="custom-image-col animate-in">
              <img
                src="/catalog/Rings__Wedding_ring_2.png"
                alt="Custom jewelry crafting"
              />
              <div className="custom-image-frame" aria-hidden="true" />
              <div className="custom-image-fade" aria-hidden="true" />
              <div className="custom-stat-badge">
                <div className="custom-stat-num">100%</div>
                <div className="custom-stat-label">Handcrafted<br />Every Piece</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
