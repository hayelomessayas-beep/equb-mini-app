import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

interface EqubType {
  id: string;
  name: string;
  amount: number;
  cycle: string;
}

interface PaymentReceipt {
  id: number;
  memberName: string;
  equbType: string;
  amount: number;
  refNumber: string;
  status: 'pending' | 'approved';
  date: string;
}

interface Member {
  id: number;
  name: string;
  phone: string;
  equbTypeId: string;
  paid: boolean;
  won: boolean;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
      };
    };
  }
}

const EQUB_TYPES: EqubType[] = [
  { id: 'daily', name: 'የቀን ዕቁብ', amount: 100, cycle: 'በየቀኑ' },
  { id: 'weekly', name: 'የሳምንት ዕቁብ', amount: 1000, cycle: 'በየሳምንቱ' },
  { id: 'monthly', name: 'የወር ዕቁብ', amount: 5000, cycle: 'በየወሩ' },
];

const App = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<string>('አባል');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'register' | 'pay' | 'history'>('dashboard');

  const [selectedEqub, setSelectedEqub] = useState<string>('weekly');

  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: 'አበበ ከበደ', phone: '0911223344', equbTypeId: 'weekly', paid: true, won: false },
    { id: 2, name: 'ማርታ አለሙ', phone: '0922334455', equbTypeId: 'weekly', paid: true, won: false },
    { id: 3, name: 'ዮሐንስ ተስፋዬ', phone: '0933445566', equbTypeId: 'weekly', paid: false, won: false },
    { id: 4, name: 'ሰላማዊት ደስታ', phone: '0944556677', equbTypeId: 'weekly', paid: true, won: true },
  ]);

  const [receipts, setReceipts] = useState<PaymentReceipt[]>([
    { id: 101, memberName: 'ዮሐንስ ተስፋዬ', equbType: 'የሳምንት ዕቁብ', amount: 1000, refNumber: 'TX123456', status: 'pending', date: 'ዛሬ' }
  ]);

  // Form states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEqub, setRegEqub] = useState('weekly');

  const [payName, setPayName] = useState('');
  const [payRef, setPayRef] = useState('');

  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Member | null>(null);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setCurrentUser(tgUser.first_name);
      setRegName(tgUser.first_name);
      setPayName(tgUser.first_name);
    }
  }, []);

  const currentEqubInfo = EQUB_TYPES.find(e => e.id === selectedEqub) || EQUB_TYPES[1];
  const filteredMembers = members.filter(m => m.equbTypeId === selectedEqub);

  const totalCollected = filteredMembers.reduce((acc, m) => acc + (m.paid ? currentEqubInfo.amount : 0), 0);
  const totalTarget = filteredMembers.length * currentEqubInfo.amount;
  const progress = Math.round((totalCollected / (totalTarget || 1)) * 100) || 0;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) return;
    const newM: Member = {
      id: Date.now(),
      name: regName,
      phone: regPhone || '0900000000',
      equbTypeId: regEqub,
      paid: false,
      won: false
    };
    setMembers([...members, newM]);
    alert('በተ his መዝግበዋል! አሁን ክፍያ መፈጸም ይችላሉ።');
    setActiveTab('pay');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payName || !payRef) return;
    const newR: PaymentReceipt = {
      id: Date.now(),
      memberName: payName,
      equbType: currentEqubInfo.name,
      amount: currentEqubInfo.amount,
      refNumber: payRef,
      status: 'pending',
      date: 'አሁን'
    };
    setReceipts([...receipts, newR]);
    setPayRef('');
    alert('የክፍያ ደረሰኝዎ ለAdmin ተልኳል! ሲረጋገጥ ክፍያዎ ይቀየራል።');
  };

  const approveReceipt = (id: number, memberName: string) => {
    setReceipts(receipts.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    setMembers(members.map(m => m.name === memberName ? { ...m, paid: true } : m));
  };

  const drawLottery = () => {
    const eligible = filteredMembers.filter(m => !m.won && m.paid);
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

        {/* Top User Bar */}
        <div style={styles.topBar}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            👤 ሰላም {currentUser} ({isAdmin ? 'Admin' : 'Member'})
          </span>
          <button onClick={() => setIsAdmin(!isAdmin)} style={styles.switchBtn}>
            {isAdmin ? 'ወደ Member View' : 'ወደ Admin View'}
          </button>
        </div>

        {/* Equb Selector */}
        <div style={styles.equbSelector}>
          {EQUB_TYPES.map(eq => (
            <button
              key={eq.id}
              onClick={() => setSelectedEqub(eq.id)}
              style={{
                ...styles.equbTab,
                background: selectedEqub === eq.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
                color: selectedEqub === eq.id ? '#0f172a' : '#cbd5e1',
                fontWeight: selectedEqub === eq.id ? 'bold' : 'normal'
              }}
            >
              {eq.name}
            </button>
          ))}
        </div>

        {/* Navigation Bar */}
        <div style={styles.navBar}>
          <button onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? styles.activeNav : styles.navBtn}>📊 ዳሽቦርድ</button>
          <button onClick={() => setActiveTab('register')} style={activeTab === 'register' ? styles.activeNav : styles.navBtn}>📝 መመዝገቢያ</button>
          <button onClick={() => setActiveTab('pay')} style={activeTab === 'pay' ? styles.activeNav : styles.navBtn}>💳 ክፍያ ፈፅም</button>
          <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? styles.activeNav : styles.navBtn}>🏆 አሸናፊዎች</button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <p style={styles.statLabel}>የ{currentEqubInfo.name} አባላት</p>
                <h2 style={styles.statValue}>{filteredMembers.length}</h2>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statLabel}>የተሰበሰበ ገንዘብ</p>
                <h2 style={{ ...styles.statValue, color: '#4ade80' }}>{totalCollected.toLocaleString()} ብር</h2>
              </div>
            </div>

            <div style={styles.progressSection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>የክፍያ ሂደት</span>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>{progress}%</span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Lottery Section */}
            <div style={styles.lotteryBox}>
              <h3 style={styles.sectionTitle}>🎲 የዲጂታል ዕጣ ማውጫ ({currentEqubInfo.name})</h3>
              {isAdmin ? (
                <button onClick={drawLottery} disabled={isSpinning} style={styles.spinButton}>
                  {isSpinning ? 'ዕጣ እየወጣ ነው...' : '✨ ዕጣ አውጣ'}
                </button>
              ) : (
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>ℹ️ ዕጣ የሚወጣው በዕቁብ ሰብሳቢው (Admin) ብቻ ነው።</p>
              )}

              {winner && (
                <div style={styles.winnerCard}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#e2e8f0' }}>🎉 የዚህ ዙር አሸናፊ!</p>
                  <h2 style={{ margin: '4px 0', color: '#facc15' }}>{winner.name}</h2>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>እንኳን ደስ አለዎት!</p>
                </div>
              )}
            </div>

            {/* Admin Approvals Section */}
            {isAdmin && receipts.filter(r => r.status === 'pending').length > 0 && (
              <div style={{ ...styles.section, border: '1px solid #f59e0b', padding: '12px', borderRadius: '12px' }}>
                <h3 style={{ ...styles.sectionTitle, color: '#f59e0b' }}>⚠️ ያልተረጋገጡ ክፍያዎች (Pending)</h3>
                {receipts.filter(r => r.status === 'pending').map(r => (
                  <div key={r.id} style={styles.receiptCard}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{r.memberName}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Ref: {r.refNumber} • {r.amount} ብር</p>
                    </div>
                    <button onClick={() => approveReceipt(r.id, r.memberName)} style={styles.approveBtn}>Approve</button>
                  </div>
                ))}
              </div>
            )}

            {/* Members List */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>👥 የአባላት ሁኔታ</h3>
              <div style={styles.memberList}>
                {filteredMembers.map(m => (
                  <div key={m.id} style={styles.memberCard}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px' }}>{m.name}</h4>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{m.phone}</p>
                    </div>
                    <span style={{ color: m.paid ? '#4ade80' : '#f87171', fontWeight: 'bold', fontSize: '12px' }}>
                      {m.paid ? '✓ ከፍሏል' : '✗ አልከፈለም'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📝 ለዕቁብ መመዝገቢያ</h3>
            <form onSubmit={handleRegister} style={styles.form}>
              <label style={styles.label}>የአባል ስም</label>
              <input type="text" value={regName} onChange={e => setRegName(e.target.value)} style={styles.input} required />
              
              <label style={styles.label}>ስልክ ቁጥር</label>
              <input type="text" placeholder="09..." value={regPhone} onChange={e => setRegPhone(e.target.value)} style={styles.input} required />

              <label style={styles.label}>የዕቁብ አይነት መረጣ</label>
              <select value={regEqub} onChange={e => setRegEqub(e.target.value)} style={styles.input}>
                {EQUB_TYPES.map(e => (
                  <option key={e.id} value={e.id} style={{ color: '#000' }}>{e.name} ({e.amount} ብር {e.cycle})</option>
                ))}
              </select>

              <button type="submit" style={styles.submitBtn}>ተመዝገብ</button>
            </form>
          </div>
        )}

        {/* TAB 3: PAY */}
        {activeTab === 'pay' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💳 ክፍያ ፈፅም ({currentEqubInfo.name})</h3>
            <div style={styles.bankInfoBox}>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: 'bold' }}>የክፍያ አማራጮች፦</p>
              <p style={{ margin: 0, fontSize: '12px' }}>📱 <b>Telebirr:</b> 0911223344 (እቁብ ሰብሳቢ)</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>🏦 <b>CBE:</b> 1000123456789</p>
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#facc15' }}>የሚከፍሉት መጠን፦ <b>{currentEqubInfo.amount} ብር</b></p>
            </div>

            <form onSubmit={handlePaymentSubmit} style={styles.form}>
              <label style={styles.label}>የከፋዩ ስም</label>
              <input type="text" value={payName} onChange={e => setPayName(e.target.value)} style={styles.input} required />

              <label style={styles.label}>የክፍያ ማረጋገጫ ቁጥር (Transaction Ref / ID)</label>
              <input type="text" placeholder="ለምሳሌ፦ TX123456" value={payRef} onChange={e => setPayRef(e.target.value)} style={styles.input} required />

              <button type="submit" style={styles.submitBtn}>የክፍያ ደረሰኝ ላክ</button>
            </form>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🏆 የዕጣ አሸናፊዎች ታሪክ</h3>
            <div style={styles.memberList}>
              {members.filter(m => m.won).map(m => (
                <div key={m.id} style={styles.memberCard}>
                  <div>
                    <h4 style={{ margin: 0, color: '#facc15' }}>👑 {m.name}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>የ{EQUB_TYPES.find(e => e.id === m.equbTypeId)?.name}</p>
                  </div>
                  <span style={{ fontSize: '11px', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', padding: '2px 8px', borderRadius: '4px' }}>አሸናፊ</span>
                </div>
              ))}
              {members.filter(m => m.won).length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>እስካሁን ዕጣ የወጣለት አባል የለም።</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxSizing: 'border-box'
  },
  glassCard: {
    width: '100%',
    maxWidth: '480px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    borderRadius: '20px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff'
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  switchBtn: {
    background: 'rgba(56, 189, 248, 0.2)',
    border: '1px solid #38bdf8',
    color: '#38bdf8',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  equbSelector: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '6px',
    marginBottom: '12px'
  },
  equbTab: {
    padding: '8px 4px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '11px',
    cursor: 'pointer'
  },
  navBar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '4px',
    marginBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '8px'
  },
  navBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    fontSize: '11px',
    padding: '6px 2px',
    cursor: 'pointer'
  },
  activeNav: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '6px',
    fontSize: '11px',
    padding: '6px 2px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '12px'
  },
  statBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center'
  },
  statLabel: {
    margin: '0 0 4px 0',
    fontSize: '10px',
    color: '#94a3b8'
  },
  statValue: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold'
  },
  progressSection: {
    marginBottom: '16px'
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #38bdf8, #4ade80)',
    borderRadius: '10px'
  },
  lotteryBox: {
    background: 'rgba(129, 140, 248, 0.1)',
    border: '1px solid rgba(129, 140, 248, 0.2)',
    borderRadius: '14px',
    padding: '12px',
    textAlign: 'center',
    marginBottom: '16px'
  },
  spinButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer'
  },
  winnerCard: {
    marginTop: '10px',
    padding: '10px',
    background: 'rgba(250, 204, 21, 0.15)',
    border: '1px solid rgba(250, 204, 21, 0.3)',
    borderRadius: '10px'
  },
  section: {
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '13px',
    margin: '0 0 10px 0',
    color: '#cbd5e1'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '11px',
    color: '#94a3b8'
  },
  input: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(0, 0, 0, 0.2)',
    color: '#fff',
    fontSize: '12px',
    outline: 'none'
  },
  submitBtn: {
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    background: '#38bdf8',
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: '13px',
    marginTop: '6px',
    cursor: 'pointer'
  },
  memberList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  memberCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  bankInfoBox: {
    background: 'rgba(56, 189, 248, 0.1)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '12px'
  },
  receiptCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0,0,0,0.3)',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '6px'
  },
  approveBtn: {
    background: '#22c55e',
    color: '#fff',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
