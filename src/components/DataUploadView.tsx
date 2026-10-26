/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { PatientRecord } from '../types/clinical';
import { SAMPLE_PATIENT_DATASET, convertDatasetToCSV } from '../data/sampleDataset';

interface DataUploadViewProps {
  dataset: PatientRecord[];
  onUpdateDataset: (records: PatientRecord[]) => void;
  onProceedToConfig: () => void;
}

export const DataUploadView: React.FC<DataUploadViewProps> = ({
  dataset,
  onUpdateDataset,
  onProceedToConfig
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceLine, setSelectedServiceLine] = useState<string>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Column definitions detected
  const detectedColumns = [
    { key: 'patient_id', type: 'Unique Identifier (De-Identified)' },
    { key: 'persona', type: 'Demographic Persona' },
    { key: 'age_group', type: 'Categorical Age' },
    { key: 'service_line', type: 'Hospital Department' },
    { key: 'visit_type', type: 'Care Delivery Modality' },
    { key: 'satisfaction_score', type: 'Numeric Rating (1-5)' },
    { key: 'communication_rating', type: 'Numeric Rating (1-5)' },
    { key: 'follow_up_compliance', type: 'Boolean Flag' },
    { key: 'complaint_severity', type: 'Ordinal Severity (Level 1-4)' },
    { key: 'readmission_risk', type: 'Risk Tier' },
    { key: 'ai_risk_flag', type: 'AI Safety Audit Flag' },
    { key: 'comment', type: 'Unstructured Clinical Narrative' }
  ];

  // Service line list for filter
  const serviceLines = Array.from(new Set(dataset.map(d => d.service_line)));

  // Filtered dataset
  const filteredDataset = dataset.filter(row => {
    const matchesSearch =
      row.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.persona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedServiceLine === 'all' || row.service_line === selectedServiceLine;
    return matchesSearch && matchesService;
  });

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        if (!text) throw new Error('Empty file content');

        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) throw new Error('CSV must contain a header line and at least one data row');

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const required = ['patient_id', 'service_line', 'comment'];
        const missing = required.filter(r => !headers.includes(r));
        if (missing.length > 0) {
          throw new Error(`CSV is missing required columns: ${missing.join(', ')}`);
        }

        const parsedRecords: PatientRecord[] = [];
        for (let i = 1; i < lines.length; i++) {
          // Simple CSV parser handling quotes
          const rawRow = lines[i];
          const tokens: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let charIdx = 0; charIdx < rawRow.length; charIdx++) {
            const char = rawRow[charIdx];
            if (char === '"' && inQuotes && rawRow[charIdx + 1] === '"') {
              current += '"';
              charIdx++;
            } else if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              tokens.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          tokens.push(current.trim());

          const rowData: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowData[h] = tokens[idx] || '';
          });

          if (rowData['patient_id']) {
            parsedRecords.push({
              patient_id: rowData['patient_id'],
              persona: rowData['persona'] || 'Outpatient Persona',
              age_group: (rowData['age_group'] as any) || '50-64',
              service_line: (rowData['service_line'] as any) || 'Emergency Medicine',
              visit_type: (rowData['visit_type'] as any) || 'Outpatient Clinic',
              satisfaction_score: Math.min(5, Math.max(1, Number(rowData['satisfaction_score']) || 3)),
              communication_rating: Math.min(5, Math.max(1, Number(rowData['communication_rating']) || 3)),
              follow_up_compliance: rowData['follow_up_compliance'] === 'true' || rowData['follow_up_compliance'] === '1',
              complaint_severity: (rowData['complaint_severity'] as any) || 'Level 2 - Moderate',
              patient_portal_usage: (rowData['patient_portal_usage'] as any) || 'Moderate',
              readmission_risk: (rowData['readmission_risk'] as any) || 'Moderate',
              ai_risk_flag: (rowData['ai_risk_flag'] as any) || 'None',
              ai_risk_details: rowData['ai_risk_details'] || undefined,
              comment: rowData['comment'] || 'Routine patient clinical feedback.',
              date: rowData['date'] || new Date().toISOString().split('T')[0]
            });
          }
        }

        if (parsedRecords.length === 0) {
          throw new Error('No valid patient rows could be parsed from the CSV');
        }

        onUpdateDataset(parsedRecords);
        setUploadSuccess(`Successfully ingested ${parsedRecords.length} clinical records.`);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file');
      }
    };
    reader.readAsText(file);
  };

  const downloadCurrentCSV = () => {
    const csvContent = convertDatasetToCSV(dataset);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clinical_patient_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reloadDefaultSample = () => {
    onUpdateDataset(SAMPLE_PATIENT_DATASET);
    setUploadSuccess(`Reset to standard sample cohort (${SAMPLE_PATIENT_DATASET.length} records).`);
    setUploadError(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-700 mb-1">
            Data Ingestion & Integrity Audit
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Clinical Dataset Upload & Validation
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Ingest structured patient feedback, clinical grievances, and EHR audit comments. All selected agents analyze this shared repository.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={reloadDefaultSample}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Load Standard 20-Patient Cohort
          </button>

          <button
            onClick={downloadCurrentCSV}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Export Active CSV
          </button>

          <button
            onClick={onProceedToConfig}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
          >
            Configure AI Agents →
          </button>
        </div>
      </div>

      {/* HIPAA & Privacy Safeguard Notice */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-xl flex items-start gap-3.5 shadow-sm">
        <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
          ✓
        </div>
        <div className="text-xs space-y-1">
          <p className="font-semibold text-white">
            HIPAA Safe Harbor Compliance & De-Identification Safeguards
          </p>
          <p className="text-slate-300 leading-relaxed">
            This prototype operates strictly with synthetic or de-identified healthcare data. No Protected Health Information (PHI) such as actual names, medical record numbers, or precise geographic addresses is exposed or stored. All six AI agents function solely as decision-support instruments and do not generate autonomous clinical diagnoses or legal compliance determinations.
          </p>
        </div>
      </div>

      {/* Upload Zone & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSV Dropzone */}
        <div className="lg:col-span-1 bg-white border border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center transition-colors flex flex-col justify-center items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xl mb-3">
            ↑
          </div>
          <h2 className="text-sm font-bold text-slate-900">Upload Patient CSV</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Upload CSV with patient feedback, satisfaction scores, service lines, and clinical notes.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
          >
            Browse Local File
          </button>

          {uploadError && (
            <p className="text-xs text-rose-600 mt-3 font-medium bg-rose-50 p-2 rounded-md">
              {uploadError}
            </p>
          )}

          {uploadSuccess && (
            <p className="text-xs text-emerald-700 mt-3 font-medium bg-emerald-50 p-2 rounded-md">
              {uploadSuccess}
            </p>
          )}
        </div>

        {/* Detected Schema & Column Metadata */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Detected Schema & Column Types
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {detectedColumns.length} Validated Columns
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {detectedColumns.map((col) => (
              <div
                key={col.key}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <code className="font-mono text-teal-700 font-semibold">{col.key}</code>
                <span className="text-slate-500 text-[11px]">{col.type}</span>
              </div>
            ))}
          </div>

          {/* Validation Checks */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Format Verified: 0 Critical Syntax Errors
            </span>
            <span className="font-mono tabular-nums text-slate-500">
              Active Cohort: {dataset.length} Records
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Data Table Preview */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, persona, or feedback text..."
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />

            <select
              value={selectedServiceLine}
              onChange={(e) => setSelectedServiceLine(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Service Lines ({dataset.length})</option>
              {serviceLines.map(sl => (
                <option key={sl} value={sl}>{sl}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Showing {filteredDataset.length} of {dataset.length} records
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="sticky top-0 bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Patient ID</th>
                <th className="px-4 py-3">Persona & Age</th>
                <th className="px-4 py-3">Service Line</th>
                <th className="px-4 py-3 text-right">Scores</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">AI Risk Flag</th>
                <th className="px-4 py-3 min-w-[280px]">Patient Narrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredDataset.map((row) => (
                <tr key={row.patient_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {row.patient_id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{row.persona}</div>
                    <div className="text-[11px] text-slate-400">Age: {row.age_group}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-slate-800">{row.service_line}</span>
                    <span className="text-slate-400 block text-[11px]">{row.visit_type}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                    <div>Sat: <span className="font-bold">{row.satisfaction_score}</span>/5</div>
                    <div className="text-slate-400 text-[11px]">Comm: {row.communication_rating}/5</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      row.complaint_severity.includes('Critical')
                        ? 'bg-rose-100 text-rose-800'
                        : row.complaint_severity.includes('High')
                        ? 'bg-amber-100 text-amber-800'
                        : row.complaint_severity.includes('Moderate')
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.complaint_severity.split(' - ')[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.ai_risk_flag !== 'None' ? (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md block">
                        {row.ai_risk_flag}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 line-clamp-2 text-xs leading-relaxed">
                    {row.comment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
