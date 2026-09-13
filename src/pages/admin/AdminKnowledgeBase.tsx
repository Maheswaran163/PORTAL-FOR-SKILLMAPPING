import React, { useState } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Edit,
  Search,
  Sparkles,
  CheckCircle2,
  X,
  Code2,
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ragService, generateSimpleEmbedding } from '../../services/ragService';
import { KnowledgeBaseItem } from '../../types';

export const AdminKnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeBaseItem[]>(() => storageService.getKnowledgeBase());
  const [showModal, setShowModal] = useState(false);
  const [testQuery, setTestQuery] = useState('How do I close cloud computing gap?');
  const [simResults, setSimResults] = useState<any[]>([]);

  // New Item State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<KnowledgeBaseItem['category']>('Skill Guidance');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('cloud, kubernetes, certification');
  const [sourceType, setSourceType] = useState<KnowledgeBaseItem['sourceType']>('skill');

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim());
    const embedding = generateSimpleEmbedding(`${title} ${content} ${tags.join(' ')}`);

    const newItem: KnowledgeBaseItem = {
      id: `kb-${Date.now()}`,
      title,
      category,
      content,
      sourceType,
      tags,
      embedding,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveKnowledgeBaseItem(newItem);
    setItems(storageService.getKnowledgeBase());
    setShowModal(false);

    setTitle('');
    setContent('');
  };

  const handleDelete = (id: string) => {
    storageService.deleteKnowledgeBaseItem(id);
    setItems(storageService.getKnowledgeBase());
  };

  const handleTestSearch = () => {
    const results = ragService.retrieveTopK(testQuery, 4);
    setSimResults(results);
  };

  return (
    <div className="min-h-screen bg-bg py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-dark/15 text-primary-dark text-xs font-bold uppercase tracking-wider mb-2">
              RAG Vector Index
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary-dark">
              Knowledge Base & Vector Store
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Manage grounded knowledge entries, inspect vector embeddings, and test top-K retrieval similarity.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Item</span>
          </button>
        </div>

        {/* Vector Search Simulator Box */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Interactive Vector Search Simulator (Cosine Top-K Retrieval)</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={e => setTestQuery(e.target.value)}
              placeholder="Test any natural language query..."
              className="flex-1 p-2.5 rounded-xl bg-bg/60 border border-border text-xs text-text focus:outline-none focus:bg-surface"
            />
            <button
              onClick={handleTestSearch}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-sm transition-colors"
            >
              Test Query Vector
            </button>
          </div>

          {simResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {simResults.map((res, rIdx) => (
                <div key={rIdx} className="p-3.5 bg-bg rounded-2xl border border-border space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary truncate max-w-[220px]">{res.title}</span>
                    <span className="px-2 py-0.5 rounded bg-success/15 text-success font-bold text-[10px]">
                      {Math.round(res.similarityScore * 100)}% Sim
                    </span>
                  </div>
                  <p className="text-text-muted text-[11px] line-clamp-2">{res.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Knowledge Base Entries List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-surface rounded-3xl p-6 border border-border shadow-soft flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-text-muted hover:text-error p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-serif text-lg font-bold text-primary-dark">
                  {item.title}
                </h3>

                <p className="text-xs text-text-muted leading-relaxed">
                  {item.content}
                </p>

                {/* Dense Vector Preview */}
                {item.embedding && (
                  <div className="p-2.5 bg-bg-alt/70 rounded-xl border border-border font-mono text-[10px] text-text-muted space-y-1">
                    <div className="flex items-center justify-between text-text font-bold">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-accent" /> 16-Dim Dense Vector:
                      </span>
                    </div>
                    <div className="truncate text-accent font-semibold">
                      [{item.embedding.map(v => v.toFixed(2)).join(', ')}]
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-bg text-text border border-border">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add Item */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-surface rounded-3xl border border-border shadow-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="font-serif text-lg font-bold text-primary-dark">Add Knowledge Entry</h3>
                <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Consensus Benchmark Standard"
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-text-muted uppercase mb-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border"
                    >
                      <option value="Skill Guidance">Skill Guidance</option>
                      <option value="Industry Benchmark">Industry Benchmark</option>
                      <option value="Career Pathway">Career Pathway</option>
                      <option value="Curriculum Sync">Curriculum Sync</option>
                      <option value="Opportunity">Opportunity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-text-muted uppercase mb-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      required
                      value={tagsInput}
                      onChange={e => setTagsInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-bg/60 border border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-text-muted uppercase mb-1">Content / Document Text</label>
                  <textarea
                    rows={4}
                    required
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Provide authoritative text that Claude RAG will synthesize..."
                    className="w-full p-2.5 rounded-xl bg-bg/60 border border-border resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-border">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-primary text-surface font-bold">
                    Generate Embedding & Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
