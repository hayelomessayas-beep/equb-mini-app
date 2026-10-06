import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  const [members] = useState([
    { id: 1, name: 'አበበ ከበደ', share: 1000, paid: true },
    { id: 2, name: 'ማርታ አለሙ', share: 1000, paid: true },
    { id: 3, name: 'ዮሐንስ ተስፋዬ', share: 1000, paid: false },
  ]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h2 style={{ color: '#0088cc', textAlign: 'center' }}>🔄 የእቁብ አስተዳደር ዳሽቦርድ</h2>
      <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
        <h3>የእቁብ አጠቃላይ መረጃ</h3>
        <p>💰 የዕለት ዕቁብ መጠን፦ <strong>1,000 ብር</strong></p>
        <p>👥 ጠቅላላ አባላት፦ <strong>3</strong></p>
      </div>

      <h3>የአባላት ሁኔታ</h3>
      {members.map(m => (
        <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#2a2a2a', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
          <span>{m.name} ({m.share} ብር)</span>
          <span style={{ color: m.paid ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
            {m.paid ? 'ከፍሏል' : 'አልከፈለም'}
          </span>
        </div>
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
