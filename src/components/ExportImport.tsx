import React, { useState } from 'react';
import { AppState } from '../types';
import { storage } from '../services/storage';

interface ExportImportProps {
  state: AppState;
  onImport: (state: AppState) => void;
  onClose: () => void;
}

export const ExportImport: React.FC<ExportImportProps> = ({ state, onImport, onClose }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importData, setImportData] = useState('');
  const [message, setMessage] = useState('');

  const handleExportJSON = () => {
    const json = storage.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remnote-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage('✅ Data exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleExportMarkdown = () => {
    const markdown = storage.exportToMarkdown(state.notes);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remnote-notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage('✅ Notes exported to Markdown!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = () => {
    try {
      const newState = storage.importData(importData);
      onImport(newState);
      setMessage('✅ Data imported successfully!');
      setImportData('');
      setTimeout(() => {
        setMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      setMessage('❌ Invalid data format. Please check your JSON.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              📦 Export / Import
            </h2>
            <p className="text-slate-400 text-lg">Backup and restore your data</p>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary flex items-center gap-2"
          >
            <span>✕</span>
            <span>Close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="mr-2">📤</span>
            Export Data
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'import'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="mr-2">📥</span>
            Import Data
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-center text-indigo-300 font-medium animate-slide-up">
            {message}
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-8 border border-indigo-500/20">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <span>📄</span>
                Export as JSON
              </h3>
              <p className="text-slate-400 mb-6">
                Download all your notes, flashcards, and settings as a JSON file. This is the recommended format for full backups.
              </p>
              <button
                onClick={handleExportJSON}
                className="btn-primary flex items-center gap-2"
              >
                <span>💾</span>
                <span>Download JSON Backup</span>
              </button>
            </div>

            <div className="glass-card rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <span>📝</span>
                Export as Markdown
              </h3>
              <p className="text-slate-400 mb-6">
                Export your notes as a Markdown file. Great for sharing or importing into other note-taking apps.
              </p>
              <button
                onClick={handleExportMarkdown}
                className="btn-secondary flex items-center gap-2"
              >
                <span>📄</span>
                <span>Download Markdown</span>
              </button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h4 className="font-bold text-blue-300 mb-2">Backup Tips</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Create regular backups to prevent data loss</li>
                    <li>• JSON backups preserve all data including flashcard progress</li>
                    <li>• Markdown exports are great for sharing notes</li>
                    <li>• Store backups in a safe location (cloud storage recommended)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-8 border border-indigo-500/20">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <span>📁</span>
                Import from File
              </h3>
              <p className="text-slate-400 mb-6">
                Select a JSON backup file to restore your data.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white file:font-medium hover:file:bg-indigo-600 transition-all"
              />
            </div>

            <div className="glass-card rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                <span>✏️</span>
                Or Paste JSON Data
              </h3>
              <p className="text-slate-400 mb-6">
                Paste your JSON backup data below:
              </p>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder='{"notes": {...}, "flashcards": {...}, ...}'
                className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 transition-all font-mono text-sm resize-none"
              />
              <button
                onClick={handleImport}
                disabled={!importData.trim()}
                className="btn-success mt-4 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📥</span>
                <span>Import Data</span>
              </button>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-red-300 mb-2">Warning</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Importing will replace ALL existing data</li>
                    <li>• Make sure to backup your current data first</li>
                    <li>• Only import JSON files from trusted sources</li>
                    <li>• Invalid data format may cause errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-indigo-400">{Object.keys(state.notes).length}</div>
            <div className="text-sm text-slate-400 mt-1">Notes</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{Object.keys(state.flashcards).length}</div>
            <div className="text-sm text-slate-400 mt-1">Flashcards</div>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400">{state.reviewSessions.length}</div>
            <div className="text-sm text-slate-400 mt-1">Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};
