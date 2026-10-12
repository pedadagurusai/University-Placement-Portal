import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Filter, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { PlacementAnalytics, Department } from '../types/index.ts';

interface PlacementDashboardViewProps {
  analytics: PlacementAnalytics | null;
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  selectedBatch: string;
  setSelectedBatch: (batch: string) => void;
  departments: Department[];
  batches: string[];
}

export const PlacementDashboardView: React.FC<PlacementDashboardViewProps> = ({
  analytics,
  selectedDept,
  setSelectedDept,
  selectedBatch,
  setSelectedBatch,
  departments,
  batches
}) => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');

  if (!analytics) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Loading placement analytics...
      </div>
    );
  }

  const filteredCompanyStats = selectedCompanyFilter === 'All'
    ? analytics.companyStats
    : analytics.companyStats.filter(c => c.companyName === selectedCompanyFilter);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar & Formula Definition Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>Analytics Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Academic Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="">All Batches</option>
            {batches.map(b => (
              <option key={b} value={b}>Batch {b}</option>
            ))}
          </select>

          {/* Company Filter */}
          <select
            value={selectedCompanyFilter}
            onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 font-medium"
          >
            <option value="All">All Companies</option>
            {analytics.companyStats.map(c => (
              <option key={c.driveId} value={c.companyName}>{c.companyName}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters reset if active */}
        {(selectedDept || selectedBatch || selectedCompanyFilter !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSelectedDept('');
              setSelectedBatch('');
              setSelectedCompanyFilter('All');
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Explicit Formula Standard Callout (Acceptance Rule) */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 flex items-start space-x-3">
        <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-indigo-900">
            Institutional Placement Calculation Standard:
          </div>
          <p className="text-slate-700 leading-relaxed">
            <strong>Placement Rate (%)</strong> = <code className="bg-white px-1.5 py-0.5 rounded border border-indigo-200 font-bold text-indigo-800">(Unique Students Placed / Eligible Registered Students) × 100</code>.
            Total offers received (<span className="font-bold text-emerald-800">{analytics.totalOffers} offers</span>) and unique placed students (<span className="font-bold text-emerald-800">{analytics.uniqueStudentsPlaced} students</span>) are tracked strictly as separate metrics. Multiple offers received by a single candidate do not artificially inflate the unique student placement count. Cancelled drives and withdrawn applications are automatically excluded.
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Registered Students</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{analytics.totalRegistered}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Formal placement opt-ins</span>
          </div>
        </div>

        {/* Eligible Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Eligible Pool</span>
            <Award className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-indigo-900">{analytics.totalEligible}</span>
            <span className="text-xs text-indigo-600 block mt-0.5">Met CGPA & 0-backlog rule</span>
          </div>
        </div>

        {/* Unique Placed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between text-emerald-700 text-xs">
            <span className="font-semibold">Unique Students Placed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-emerald-900">{analytics.uniqueStudentsPlaced}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {analytics.overallPlacementPercentage}% Rate
              </span>
            </div>
            <span className="text-xs text-emerald-700 block mt-0.5">Denominator: Eligible pool</span>
          </div>
        </div>

        {/* Total Offers Received */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Offers Extended</span>
            <Briefcase className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-indigo-900">{analytics.totalOffers}</span>
              {analytics.totalOffers > analytics.uniqueStudentsPlaced && (
                <span className="text-[11px] font-semibold text-indigo-600">
                  +{analytics.totalOffers - analytics.uniqueStudentsPlaced} Multi-Offers
                </span>
              )}
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Across all company drives</span>
          </div>
        </div>

        {/* Unplaced Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Unplaced Eligible Students</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-900">{analytics.unplacedStudents}</span>
            <span className="text-xs text-amber-700 block mt-0.5">Active candidates in hiring</span>
          </div>
        </div>

        {/* Participating Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Participating in Drives</span>
            <Users className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{analytics.participatingStudents}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Applied to at least 1 drive</span>
          </div>
        </div>

        {/* Highest Package */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Highest Package (LPA)</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{analytics.highestPackageLPA} LPA</span>
            <span className="text-xs text-slate-500 block mt-0.5">Top offer CTC secured</span>
          </div>
        </div>

        {/* Average Package */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Average Package (LPA)</span>
            <TrendingUp className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900">{analytics.averagePackageLPA} LPA</span>
            <span className="text-xs text-slate-500 block mt-0.5">Mean across valid offers</span>
          </div>
        </div>
      </div>

      {/* Department-wise Placement Statistics (Module 4 Core) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Department-Wise Placement Statistics & Benchmark
            </h3>
            <p className="text-xs text-slate-500">
              Comparative analysis of eligible pool, placement percentage, and compensation packages
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Registered</th>
                <th className="py-3 px-4 text-center">Eligible</th>
                <th className="py-3 px-4 text-center">Unique Placed</th>
                <th className="py-3 px-4 text-center">Total Offers</th>
                <th className="py-3 px-4 text-center">Unplaced</th>
                <th className="py-3 px-4">Placement Rate (%)</th>
                <th className="py-3 px-4 text-right">Avg CTC</th>
                <th className="py-3 px-4 text-right">Highest CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analytics.departmentStats.map((ds, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {ds.department}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-700">
                    {ds.totalRegistered}
                  </td>
                  <td className="py-3 px-4 text-center text-indigo-700 font-medium">
                    {ds.eligibleStudents}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">
                    {ds.uniquePlaced}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-800 font-medium">
                    {ds.totalOffers}
                  </td>
                  <td className="py-3 px-4 text-center text-amber-700 font-medium">
                    {ds.unplaced}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, ds.placementPercentage)}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-900">{ds.placementPercentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-800">
                    {ds.avgPackageLPA ? `${ds.avgPackageLPA} LPA` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-700">
                    {ds.highestPackageLPA ? `${ds.highestPackageLPA} LPA` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Company-wise Outcomes & Historical Batch Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company-wise Selections & Offers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Company-Wise Recruitment Outcomes
            </h3>
            <p className="text-xs text-slate-500">
              Applications, shortlists, and final offers extended per drive
            </p>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Company & Role</th>
                  <th className="py-2.5 px-3 text-center">Applicants</th>
                  <th className="py-2.5 px-3 text-center">Shortlisted</th>
                  <th className="py-2.5 px-3 text-center">Selected</th>
                  <th className="py-2.5 px-3 text-center">Offers Released</th>
                  <th className="py-2.5 px-4 text-right">Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanyStats.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{c.companyName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{c.jobRole}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-medium">{c.applicantsCount}</td>
                    <td className="py-2.5 px-3 text-center text-indigo-700">{c.shortlistedCount}</td>
                    <td className="py-2.5 px-3 text-center text-teal-700 font-medium">{c.selectedCount}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{c.offersCount}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-800">{c.packageLPA} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Historical Batch Placement Trends */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Placement Trends Across Graduating Batches
            </h3>
            <p className="text-xs text-slate-500">
              Multi-year institutional progress (Batches 2023, 2024, 2025)
            </p>
          </div>
          <div className="p-6 space-y-5 flex-1 flex flex-col justify-center">
            {analytics.batchTrends.map((bt, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Batch {bt.batch}</span>
                  <div className="space-x-3 text-slate-600">
                    <span><strong>{bt.uniquePlaced}</strong> Unique Placed</span>
                    <span><strong>{bt.totalOffers}</strong> Total Offers</span>
                    <span className="font-bold text-indigo-600">{bt.placementPercentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${bt.placementPercentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
