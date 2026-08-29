import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ScanLine } from 'lucide-react';
import { useContactStore } from '@/stores/contactStore';
import { useToastStore } from '@/stores/toastStore';

export function AddContactScreen() {
  const navigate = useNavigate();
  const addContact = useContactStore((s) => s.addContact);
  const addToast = useToastStore((s) => s.addToast);
  const [activeTab, setActiveTab] = useState<'enter' | 'scan'>('enter');
  const [input, setInput] = useState('');
  const [name, setName] = useState('');

  const rawInput = input.replace(/^phantm:\/\//, '').trim();
  const isValid = /^[0-9a-fA-F]{64}$/.test(rawInput);

  const handleAdd = () => {
    const fullId = rawInput.toLowerCase();
    const success = addContact(fullId, name || undefined);
    if (success) {
      addToast('Contact added', 'success');
      navigate('/contacts');
    } else {
      addToast('Invalid ID or contact already exists', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={() => navigate('/contacts')} className="p-2 -ml-2" aria-label="Back">
          <ChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <h1 className="text-xl font-bold ml-2" style={{ color: 'var(--text-primary)' }}>
          Add Contact
        </h1>
      </div>

      {/* Segmented Control */}
      <div className="mx-4 mt-2 rounded-xl p-1 flex" style={{ background: 'var(--bg-surface)' }}>
        <button
          onClick={() => setActiveTab('enter')}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: activeTab === 'enter' ? 'var(--accent-pink)' : 'transparent',
            color: activeTab === 'enter' ? '#1A1218' : 'var(--text-secondary)',
          }}
        >
          Enter ID
        </button>
        <button
          onClick={() => setActiveTab('scan')}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: activeTab === 'scan' ? 'var(--accent-pink)' : 'transparent',
            color: activeTab === 'scan' ? '#1A1218' : 'var(--text-secondary)',
          }}
        >
          Scan QR
        </button>
      </div>

      <div className="flex-1 px-4 pt-6">
        {activeTab === 'enter' ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Phantm ID
              </label>
              <div
                className="flex items-center rounded-xl px-4 h-14"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--text-muted)',
                }}
              >
                <span className="text-sm flex-shrink-0" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  phantm://
                </span>
                <input
                  type="text"
                  value={input.replace(/^phantm:\/\//, '')}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="a1b2c3d4..."
                  className="ml-1 flex-1 bg-transparent text-sm outline-none"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact name"
                className="w-full rounded-xl px-4 h-14 text-base outline-none"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--text-muted)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!isValid}
              className="w-full h-14 rounded-xl text-base font-semibold mt-4 transition-all"
              style={{
                background: isValid ? 'var(--accent-pink)' : 'var(--text-muted)',
                color: isValid ? '#1A1218' : 'var(--bg-primary)',
                opacity: isValid ? 1 : 0.5,
              }}
            >
              Add Contact
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-8">
            <div
              className="w-[280px] h-[280px] rounded-2xl flex flex-col items-center justify-center"
              style={{ border: '2px dashed var(--accent-pink-dim)' }}
            >
              <ScanLine size={32} style={{ color: 'var(--accent-pink-dim)' }} />
              <p className="text-sm mt-3 text-center px-6" style={{ color: 'var(--text-muted)' }}>
                Point camera at a Phantm QR code
              </p>
            </div>
            <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
              Camera access required for QR scanning
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
