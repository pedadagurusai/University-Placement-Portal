import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  FileSpreadsheet, 
  AlertCircle, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [previewData, setPreviewData] = useState<{
    summary: {
      totalRows: number;
      validRows: number;
      invalidRows: number;
      duplicates: number;
    };
    results: any[];
  } | null>(null);
  const [importResult, setImportResult] = useState<{
    summary: {
      totalProcessed: number;
      successful: number;
      skippedOrFailed: number;
      duplicateCount: number;
    };
    skippedRows: any[];
  } | null>(null);
  const [isCommitting, setIsCommitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMsg(null);
    setPreviewData(null);
    setImportResult(null);
    setParsing(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (jsonRows.length === 0) {
        throw new Error('The selected spreadsheet contains no data rows.');
      }

      // Send to server in preview mode
      const res = await api.importStudents(jsonRows, true);
      if (res.success && res.summary && res.results) {
        setPreviewData({
          summary: res.summary,
          results: res.results
        });
      } else {
        throw new Error(res.error || 'Failed to parse file preview.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error processing spreadsheet file.');
    } finally {
      setParsing(false);
    }
  };

  const handleCommitImport = async () => {
    if (!previewData || !previewData.results) return;
    setIsCommitting(true);
    setErrorMsg(null);

    try {
      const rawRows = previewData.results.map(r => r.raw);
      const res = await api.importStudents(rawRows, false);
      if (res.success && res.summary) {
        setImportResult({
          summary: res.summary,
          skippedRows: res.skippedRows || []
        });
        onSuccess();
      } else {
        throw new Error(res.error || 'Failed to complete import.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Import commit failed.');
    } finally {
      setIsCommitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = '/api/students/template/download';
  };

  const resetState = () => {
    setFile(null);
    setPreviewData(null);
    setImportResult(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Import Students from Excel / CSV</h3>
              <p className="text-xs text-slate-500">Bulk upload student profiles with pre-validation & duplicate detection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Top Actions: Template Download & Upload Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
              <p className="text-sm font-medium text-slate-800">
                {file ? file.name : 'Select or drop Excel (.xlsx) or CSV file here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports Microsoft Excel (.xlsx, .xls) and standard comma-separated (.csv) files
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block mb-1">
                  Sample Template
                </span>
                <p className="text-xs text-amber-700 leading-relaxed mb-3">
                  Download standard headers matching roll number, departments, and CGPA formats.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>
          </div>

          {/* Parsing Spinner */}
          {parsing && (
            <div className="flex items-center justify-center p-8 space-x-2 text-indigo-600">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Validating columns, data types, and duplicates...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-3 text-rose-800 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="font-semibold">Validation Error:</strong> {errorMsg}
              </div>
            </div>
          )}

          {/* Pre-Import Preview Section */}
          {previewData && !importResult && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                  <div className="text-xl font-bold text-slate-900">{previewData.summary.totalRows}</div>
                  <div className="text-[11px] font-medium text-slate-500 uppercase">Total Rows Detected</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-200">
                  <div className="text-xl font-bold text-emerald-700">{previewData.summary.validRows}</div>
                  <div className="text-[11px] font-medium text-emerald-600 uppercase">Valid Rows Ready</div>
                </div>
                <div className="bg-rose-50 rounded-lg p-3 text-center border border-rose-200">
                  <div className="text-xl font-bold text-rose-700">{previewData.summary.invalidRows}</div>
                  <div className="text-[11px] font-medium text-rose-600 uppercase">Invalid Rows</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-200">
                  <div className="text-xl font-bold text-amber-700">{previewData.summary.duplicates}</div>
                  <div className="text-[11px] font-medium text-amber-600 uppercase">Duplicate Rolls</div>
                </div>
              </div>

              {/* Rows Preview Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 border-b border-slate-200 flex justify-between items-center">
                  <span>Row Validation Breakdown (Preview before commit)</span>
                  <span className="text-slate-500 font-normal">
                    Existing student records are never silently overwritten
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Row</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Roll No</th>
                        <th className="py-2 px-3">Student Name</th>
                        <th className="py-2 px-3">Department</th>
                        <th className="py-2 px-3">Validation Findings & Errors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewData.results.map((r, i) => (
                        <tr key={i} className={r.isValid ? 'bg-white' : 'bg-rose-50/50'}>
                          <td className="py-2 px-3 font-mono text-slate-500">#{r.rowNumber}</td>
                          <td className="py-2 px-3">
                            {r.isValid ? (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Valid</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-100 text-rose-800">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Error</span>
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono font-medium text-slate-800">
                            {r.raw?.['Roll Number'] || r.raw?.['Roll No'] || '—'}
                          </td>
                          <td className="py-2 px-3 text-slate-800 font-medium">
                            {r.raw?.['Full Name'] || r.raw?.['Student Name'] || r.raw?.['Name'] || '—'}
                          </td>
                          <td className="py-2 px-3 text-slate-600">
                            {r.raw?.['Department'] || '—'}
                          </td>
                          <td className="py-2 px-3">
                            {r.isValid ? (
                              <span className="text-emerald-700">Validated: Passed all format and uniqueness checks.</span>
                            ) : (
                              <ul className="text-rose-700 space-y-0.5 list-disc list-inside">
                                {r.errors.map((err: string, ei: number) => (
                                  <li key={ei}>{err}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Final Import Result View */}
          {importResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center space-x-3 text-emerald-800">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-semibold text-base">Import Completed Successfully</h4>
                  <p className="text-xs text-emerald-700">
                    Database updated with validated student records.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <div className="text-xl font-bold text-slate-900">{importResult.summary.totalProcessed}</div>
                  <div className="text-[11px] text-slate-500 uppercase">Processed</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <div className="text-xl font-bold text-emerald-700">{importResult.summary.successful}</div>
                  <div className="text-[11px] text-emerald-600 uppercase">Successfully Added</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
                  <div className="text-xl font-bold text-amber-700">{importResult.summary.skippedOrFailed}</div>
                  <div className="text-[11px] text-amber-600 uppercase">Skipped / Failed</div>
                </div>
              </div>

              {importResult.skippedRows.length > 0 && (
                <div className="border border-amber-200 rounded-lg bg-amber-50/70 p-3 text-xs">
                  <span className="font-semibold text-amber-900 block mb-1">Skipped Rows Report:</span>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 max-h-32 overflow-y-auto">
                    {importResult.skippedRows.map((sr, idx) => (
                      <li key={idx}>
                        Row #{sr.rowNumber} ({sr.rollNumber}): {sr.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={resetState}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Clear / Select Different File
          </button>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {importResult ? 'Close' : 'Cancel'}
            </button>

            {previewData && !importResult && (
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={isCommitting || previewData.summary.validRows === 0}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 shadow-xs"
              >
                {isCommitting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <span>Commit Import ({previewData.summary.validRows} valid rows)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
