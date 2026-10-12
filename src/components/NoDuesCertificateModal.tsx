import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Award, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Calendar,
  Download
} from 'lucide-react';
import { Student, ClearanceCategory } from '../types/index.ts';

interface NoDuesCertificateModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  categories: ClearanceCategory[];
}

export const NoDuesCertificateModal: React.FC<NoDuesCertificateModalProps> = ({
  student,
  isOpen,
  onClose,
  categories
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `NODUES-${student.graduationBatch}-${student.rollNumber}-${student.id.slice(-4).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col print:shadow-none print:border-none print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold">Institutional No-Dues Clearance Statement</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Document */}
        <div 
          ref={certificateRef}
          className="p-8 sm:p-12 text-slate-800 bg-white font-serif relative"
        >
          {/* Watermark / Seal background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <GraduationCap className="w-96 h-96 text-slate-900" />
          </div>

          {/* Certificate Border */}
          <div className="border-4 border-double border-slate-700 p-8 rounded-lg relative">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-300 pb-6 mb-6">
              <div className="flex justify-center mb-2">
                <div className="h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center text-white border-2 border-amber-500 shadow-sm">
                  <GraduationCap className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">
                Apex Institute of Technology
              </h1>
              <p className="text-xs uppercase tracking-wider text-slate-600 mt-1">
                Deemed to be University • NAAC Accredited A++ Grade
              </p>
              <p className="text-xs font-sans text-slate-500">
                Office of the Registrar & Academic Clearances, Main University Campus
              </p>
              <div className="mt-4 inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded text-xs font-sans font-bold uppercase tracking-wider text-slate-800">
                Institutional No-Dues Clearance Certificate
              </div>
            </div>

            {/* Verification Metadata Bar */}
            <div className="flex justify-between items-center text-xs font-sans border-b border-slate-200 pb-4 mb-6 text-slate-600">
              <div>
                <span className="font-semibold text-slate-800">Certificate Ref:</span>{' '}
                <span className="font-mono text-slate-900 font-bold">{certificateId}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800">Issue Date:</span>{' '}
                <span className="font-medium text-slate-900">{issueDate}</span>
              </div>
            </div>

            {/* Student Particulars */}
            <div className="mb-6 font-sans">
              <p className="text-xs leading-relaxed text-slate-700 mb-4">
                This is to officially certify that the student whose credentials are detailed below has successfully fulfilled all departmental, laboratory, library, accounts, and institutional requirements, and is granted comprehensive <strong className="text-slate-900">NO-DUES CLEARANCE</strong>.
              </p>

              <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">University Roll Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Department & Program</span>
                  <span className="font-medium text-slate-900">{student.program} in {student.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Graduation Batch & Year</span>
                  <span className="font-medium text-slate-900">Batch {student.graduationBatch} (Year {student.year}, Section {student.section})</span>
                </div>
              </div>
            </div>

            {/* Clearance Categories Breakdown Table */}
            <div className="mb-8 font-sans">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Departmental Verification Status Matrix
              </h4>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Department / Section</th>
                    <th className="p-2 border-r border-slate-300">Clearance Authority</th>
                    <th className="p-2 border-r border-slate-300">Status</th>
                    <th className="p-2">Official Remarks / Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {categories.map((cat, idx) => {
                    const item = student.noDuesChecklist.find(c => c.categoryId === cat.id);
                    const status = item?.status || 'Pending';
                    const isCleared = status === 'Cleared' || status === 'Not Applicable';

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2 font-medium text-slate-900 border-r border-slate-300">
                          {cat.name}
                        </td>
                        <td className="p-2 text-slate-600 border-r border-slate-300">
                          {cat.departmentOrAuthority}
                        </td>
                        <td className="p-2 border-r border-slate-300 font-semibold">
                          <span className={`inline-flex items-center space-x-1 ${
                            isCleared ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            <span>{status}</span>
                          </span>
                        </td>
                        <td className="p-2 text-slate-600 font-mono text-[11px]">
                          {item?.remarks || 'Verified & Authorized'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Official Signatures & Seal */}
            <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center font-sans">
              <div className="flex flex-col items-center justify-end">
                <div className="w-32 border-b border-slate-800 mb-2"></div>
                <span className="text-xs font-bold text-slate-900">Head of Department</span>
                <span className="text-[10px] text-slate-500">{student.department}</span>
              </div>

              {/* Institutional Seal Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-700 text-indigo-700 flex flex-col items-center justify-center p-1 rotate-[-8deg] shadow-inner">
                  <span className="text-[8px] uppercase font-bold tracking-tight">Apex Institute</span>
                  <Award className="h-5 w-5 my-0.5" />
                  <span className="text-[7px] uppercase font-bold">Verified Seal</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-end">
                <div className="w-32 border-b border-slate-800 mb-2"></div>
                <span className="text-xs font-bold text-slate-900">Registrar & Dean</span>
                <span className="text-[10px] text-slate-500">Student Affairs & Records</span>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
              Notice: This document is an official electronically generated University Clearance Certificate. Valid for issuance of Final Degree, Transfer Certificate, Migration, and Academic Transcripts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
