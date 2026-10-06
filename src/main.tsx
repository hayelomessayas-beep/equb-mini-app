import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

interface Member {
  id: number;
  name: string;
  phone: string;
  amount: number;
  paid: boolean;
  won: boolean;
}

const App = () => {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'አበበ ከበደ', phone: '0911223344', amount: 2000, paid: true, won: false },
    { id: 2, name: 'ማርታ አለሙ', phone: '0922334455', amount: 2000, paid: true, won: false },
    { id: 3, name: 'ዮሐንስ ተስፋዬ', phone: '0933445566', amount: 2000, paid: false, won: false },
    { id: 4, name: 'ሰላማዊት ደስታ', phone: '0944556677', amount: 2000, paid: true, won: true },
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmount, setNewAmount] = useState('2000');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Member | null>(null);

  const totalCollected = members.reduce((acc, m) => acc + (m.paid ? m.amount : 0), 0);
  const totalTarget = members.reduce((acc, m) => acc + m.amount, 0);
  const progress = Math.round((totalCollected / totalTarget) * 100) || 0;

  const togglePaid = (id: number) => {
    setMembers(members.map(m => m.id === id ? { ...m, paid: !m.paid } : m));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newMember: Member = {
      id: Date.now(),
      name: newName,
      phone: newPhone || '0900000000',
      amount: Number(newAmount) || 2000,
      paid: false,
      won: false
    };
    setMembers([...members, newMember]);
    setNewName('');
    setNewPhone('');
  };

  const drawLottery = () => {
    const eligible = members.filter(m => !m.won && m.paid);
    if (eligible.length === 0) {
      alert('ዕጣ የሚወጣላቸው ብቁ አባላት (የከፈሉና ያልወጣላቸው) የሉም!');
      return;
    }
    setIsSpinning(true);
    setWinner(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * eligible.length);
      const selectedWinner = eligible[randomIndex];
      setWinner(selectedWinner);
      setMembers(members.map(m => m.id === selectedWinner.id ? { ...m, won: true } : m));
      setIsSpinning(false);
    }, 2500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        <div style={styles.header}>
          <span style={styles.badge}>DIGITAL EQUB HUB</span>
          <h1 style={styles.title}>🔄 የዲጂታል ዕቁብ አስተዳደር</h1>
          <p style={styles.subtitle}>ቀላል፣ ፈጣን እና አስተማማኝ የእቁብ መቆጣጠሪያ</p>
        </div>

        {/* Stats Section */}
        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <p style={styles.statLabel}>የዕቁብ አባላት</p>
            <h2 style={styles.statValue}>{members.length}</h2>
          </div>
          <div style={styles.statBox}>
            <p style={styles.statLabel}>የተሰበሰበ ገንዘብ</p>
            <h2 style={{ ...styles.statValue, color: '#4ade80' }}>{totalCollected.toLocaleString()} ብር</h2>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>የክፍያ ሂደት</span>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 'bold' }}>{progress}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Lottery Section */}
        <div style={styles.lotteryBox}>
          <h3 style={styles.sectionTitle}>🎲 የዲጂታል ዕጣ ማውጫ</h3>
          <button 
            onClick={drawLottery} 
            disabled={isSpinning} 
            style={{
              ...styles.spinButton,
              opacity: isSpinning ? 0.6 : 1,
              cursor: isSpinning ? 'not-allowed' : 'pointer'
            }}
          >
            {isSpinning ? 'ዕጣ እየወጣ ነው...' : '✨ ዕጣ አውጣ'}
          </button>

          {winner && (
            <div style={styles.winnerCard}>
              <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0' }}>🎉 እንኳን ደስ አለዎት!</p>
              <h2 style={{ margin: '5px 0', color: '#facc15' }}>{winner.name}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>የዕቁቡ አሸናፊ ሆነዋል!</p>
            </div>
          )}
        </div>

        {/* Add Member Form */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>➕ አዲስ አባል መመዝገቢያ</h3>
          <form onSubmit={handleAddMember} style={styles.form}>
            <input 
              type="text" 
              placeholder="የአባል ስም" 
              value={newName} 
              onChange={e => setNewName(e.target.value)} 
              style={styles.input} 
            />
            <input 
              type="text" 
              placeholder="ስልክ ቁጥር" 
              value={newPhone} 
              onChange={e => setNewPhone(e.target.value)} 
              style={styles.input} 
            />
            <input 
              type="number" 
              placeholder="የዕቁብ መጠን (ብር)" 
              value={newAmount} 
              onChange={e => setNewAmount(e.target.value)} 
              style={styles.input} 
            />
            <button type="submit" style={styles.submitBtn}>መዝግብ</button>
          </form>
        </div>

        {/* Members List */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👥 የአባላት ዝርዝር</h3>
          <div style={styles.memberList}>
            {members.map(m => (
              <div key={m.id} style={styles.memberCard}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f8fafc' }}>{m.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{m.phone} • {m.amount.toLocaleString()} ብር</p>
                  {m.won && <span style={styles.wonBadge}>ዕጣ ወጥቶለታል</span>}
                </div>
                <button 
                  onClick={() => togglePaid(m.id)} 
                  style={{
                    ...styles.payBadge,
                    background: m.paid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: m.paid ? '#4ade80' : '#f87171',
                    border: `1px solid ${m.paid ? '#22c55e' : '#ef4444'}`
                  }}
                >
                  {m.paid ? 'ከፍሏል' : 'አልከፈለም'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: 'border-box'
  },
  glassCard: {
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    color: '#fff'
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  badge: {
    background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  title: {
    fontSize: '22px',
    margin: '10px 0 4px 0',
    color: '#f8fafc'
  },
  subtitle: {
    fontSize: '12px',
    color: '#94a3b8',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  },
  statBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '12px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center'
  },
  statLabel: {
    margin: '0 0 4px 0',
    fontSize: '11px',
    color: '#94a3b8'
  },
  statValue: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold'
  },
  progressSection: {
    marginBottom: '20px'
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #38bdf8, #4ade80)',
    borderRadius: '10px',
    transition: 'width 0.4s ease'
  },
  lotteryBox: {
    background: 'rgba(129, 140, 248, 0.1)',
    border: '1px solid rgba(129, 140, 248, 0.2)',
    borderRadius: '16px',
    padding: '16px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  spinButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px'
  },
  winnerCard: {
    marginTop: '12px',
    padding: '12px',
    background: 'rgba(250, 204, 21, 0.15)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '12px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '15px',
    margin: '0 0 12px 0',
    color: '#cbd5e1'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.2)',
    color: '#fff',
    fontSize: '13px',
    outline: 'none'
  },
  submitBtn: {
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: '#38bdf8',
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer'
  },
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  memberCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  wonBadge: {
    display: 'inline-block',
    fontSize: '10px',
    background: 'rgba(250, 204, 21, 0.2)',
    color: '#facc15',
    padding: '2px 6px',
    borderRadius: '4px',
    marginTop: '4px'
  },
  payBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
