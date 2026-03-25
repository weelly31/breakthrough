"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, RefreshCcw, Search, ShieldCheck, X } from 'lucide-react';
import ExcelJS from 'exceljs';

function getExcelColumns() {
  return [
    { header: 'Date Registered', key: 'created_at', width: 24 },
    { header: 'Full Name', key: 'full_name', width: 24 },
    { header: 'Preferred Name', key: 'preferred_name', width: 20 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Gender', key: 'gender', width: 14 },
    { header: 'Church', key: 'church', width: 28 },
    { header: 'Address', key: 'address', width: 35 },
    { header: 'Emergency Contact Name', key: 'emergency_contact_name', width: 26 },
    { header: 'Emergency Contact Number', key: 'emergency_contact_number', width: 24 },
    { header: 'Relationship', key: 'emergency_contact_relation', width: 16 },
  ];
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [churchFilter, setChurchFilter] = useState('');

  const formattedRecords = useMemo(
    () => records.map((item) => ({ ...item, _createdDisplay: new Date(item.created_at).toLocaleString() })),
    [records],
  );

  const filterOptions = useMemo(() => {
    const genders = Array.from(new Set(
      records
        .map((item) => String(item.gender || '').trim())
        .filter(Boolean),
    ));

    const churches = Array.from(new Set(
      records
        .map((item) => String(item.church || '').trim())
        .filter(Boolean),
    ));

    return {
      genders: genders.sort((a, b) => a.localeCompare(b)),
      churches: churches.sort((a, b) => a.localeCompare(b)),
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const normalizedChurch = churchFilter.trim().toLowerCase();

    return formattedRecords.filter((record) => {
      if (genderFilter !== 'all' && String(record.gender || '').toLowerCase() !== genderFilter.toLowerCase()) {
        return false;
      }

      if (normalizedChurch && String(record.church || '').toLowerCase() !== normalizedChurch) {
        return false;
      }

      if (!normalizedQuery) return true;

      const searchableText = [
        record.full_name,
        record.preferred_name,
        record.phone,
        record.gender,
        record.church,
        record.emergency_contact_name,
        record.emergency_contact_number,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ');

      return searchableText.includes(normalizedQuery);
    });
  }, [formattedRecords, searchQuery, genderFilter, churchFilter]);

  const loadRegistrations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/register?limit=500', {
        headers: {
          'x-register-read-token': token,
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load registrations.');
      }

      setRecords(payload.records || []);
      setLoaded(true);
    } catch (err) {
      setError(err?.message || 'Failed to load registrations.');
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchQuery('');
    setGenderFilter('all');
    setChurchFilter('');
  };

  const exportExcel = async () => {
    if (!filteredRecords.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    worksheet.columns = getExcelColumns();
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length },
    };

    const headerRow = worksheet.getRow(1);
    headerRow.height = 24;
    headerRow.font = { bold: true, color: { argb: 'FF1F2937' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F4F6' },
    };

    filteredRecords.forEach((record) => {
      worksheet.addRow({
        created_at: record.created_at ? new Date(record.created_at).toLocaleString() : '',
        full_name: record.full_name || '',
        preferred_name: record.preferred_name || '',
        phone: record.phone || '',
        age: record.age ?? '',
        gender: record.gender || '',
        church: record.church || '',
        address: record.address || '',
        emergency_contact_name: record.emergency_contact_name || '',
        emergency_contact_number: record.emergency_contact_number || '',
        emergency_contact_relation: record.emergency_contact_relation || '',
      });
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
          right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
        };
        if (rowNumber > 1) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          cell.font = { color: { argb: 'FF111827' } };
        }
      });

      if (rowNumber > 1) {
        row.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowNumber % 2 === 0 ? 'FFF9FAFB' : 'FFFFFFFF' },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([
      buffer,
    ], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `registrations-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.2em] uppercase font-semibold mb-2">Private Access</p>
            <h1 className="text-3xl md:text-4xl font-black">Registrations Dashboard</h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">View and export registered participants.</p>
          </div>
          <Link href="/" className="text-amber-300 hover:text-amber-200 text-sm font-medium">
            Back to landing page
          </Link>
        </div>

        <section className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
            <ShieldCheck size={16} className="text-amber-400" />
            Password is required to access records
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter password"
              className="w-full md:max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
            />
            <button
              onClick={loadRegistrations}
              disabled={loading || !token.trim()}
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 px-5 py-3 rounded-xl font-bold text-sm"
            >
              <RefreshCcw size={15} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Loading...' : 'Load Data'}
            </button>
            <button
              onClick={exportExcel}
              disabled={!records.length}
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl font-semibold text-sm"
            >
              <Download size={15} />
              Export Excel (.xlsx)
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </section>

        <section className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 md:px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-bold">Registered Participants</h2>
            <span className="text-sm text-slate-400">{filteredRecords.length} / {records.length} records</span>
          </div>

          {!!records.length && (
            <div className="px-5 md:px-6 py-4 border-b border-white/10 bg-slate-900/50">
              <div className="grid lg:grid-cols-12 gap-3">
                <div className="lg:col-span-6 flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="Search name, phone, church, emergency contact..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 rounded-xl font-semibold text-sm"
                  >
                    <Search size={14} /> Search
                  </button>
                </div>

                <div className="lg:col-span-3">
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="all" className="text-slate-900">All Genders</option>
                    {filterOptions.genders.map((gender) => (
                      <option key={gender} value={gender} className="text-slate-900">
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lg:col-span-3 flex gap-2">
                  <select
                    value={churchFilter}
                    onChange={(e) => setChurchFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="" className="text-slate-900">All Churches</option>
                    {filterOptions.churches.map((church) => (
                      <option key={church} value={church} className="text-slate-900">
                        {church}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 border border-white/20 hover:border-amber-300 text-white px-3 py-2.5 rounded-xl text-sm"
                  >
                    <X size={14} /> Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loaded && (
            <div className="p-8 text-slate-400 text-sm">Enter your password and click Load Data.</div>
          )}

          {loaded && !records.length && !error && (
            <div className="p-8 text-slate-400 text-sm">No records found yet.</div>
          )}

          {!!records.length && !filteredRecords.length && (
            <div className="p-8 text-slate-400 text-sm">No records match your search/filter.</div>
          )}

          {!!filteredRecords.length && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Preferred</th>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Age</th>
                    <th className="text-left px-4 py-3">Gender</th>
                    <th className="text-left px-4 py-3">Church</th>
                    <th className="text-left px-4 py-3">Emergency Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record._id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record._createdDisplay}</td>
                      <td className="px-4 py-3 text-white whitespace-nowrap">{record.full_name}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.preferred_name || '-'}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.phone}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.age}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.gender}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.church}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                        {record.emergency_contact_name} ({record.emergency_contact_relation}) - {record.emergency_contact_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
