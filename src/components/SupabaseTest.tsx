"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function SupabaseTest() {
  // Force rebuild
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(testName);
    try {
      const result = await testFn();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, data: result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(null);
    }
  };

  const testConnection = async () => {
    const { data, error } = await supabase.from('articles').select('count').limit(1);
    if (error) throw error;
    return data;
  };

  const testInsert = async () => {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        titre: 'Test Article',
        prix: 10.99,
        description: 'Article de test',
        categorie: 'test',
        etat: 'bon',
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select();
    if (error) throw error;
    return data;
  };

  const testUpdate = async () => {
    const { data, error } = await supabase
      .from('articles')
      .update({ titre: 'Test Article Updated' })
      .eq('titre', 'Test Article')
      .select();
    if (error) throw error;
    return data;
  };

  const testDelete = async () => {
    const { data, error } = await supabase
      .from('articles')
      .delete()
      .eq('titre', 'Test Article Updated')
      .select();
    if (error) throw error;
    return data;
  };

  const testStats = async () => {
    const { count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return { count };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">🧪 Tests Supabase</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => runTest('connection', testConnection)}
            disabled={loading === 'connection'}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading === 'connection' ? 'Test en cours...' : 'Test Connexion'}
          </button>

          <button
            onClick={() => runTest('insert', testInsert)}
            disabled={loading === 'insert'}
            className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading === 'insert' ? 'Test en cours...' : 'Test Insertion'}
          </button>

          <button
            onClick={() => runTest('update', testUpdate)}
            disabled={loading === 'update'}
            className="p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading === 'update' ? 'Test en cours...' : 'Test Mise à jour'}
          </button>

          <button
            onClick={() => runTest('delete', testDelete)}
            disabled={loading === 'delete'}
            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading === 'delete' ? 'Test en cours...' : 'Test Suppression'}
          </button>
        </div>

        <button
          onClick={() => runTest('stats', testStats)}
          disabled={loading === 'stats'}
          className="w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          {loading === 'stats' ? 'Test en cours...' : 'Test Statistiques'}
        </button>

        {/* Résultats */}
        <div className="mt-6 space-y-3">
          {Object.entries(testResults).map(([testName, result]: [string, any]) => (
            <div key={testName} className={`p-3 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">
                {testName}: {result.success ? '✅ Succès' : '❌ Échec'}
              </h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {result.success 
                  ? JSON.stringify(result.data, null, 2)
                  : result.error
                }
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 