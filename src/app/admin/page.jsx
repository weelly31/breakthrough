"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Download, Eye, EyeOff, RefreshCcw, Search, ShieldCheck, X } from 'lucide-react';
import ExcelJS from 'exceljs';

function getPaymentStatusMeta(status) {
  const normalizedStatus = String(status || 'UNPAID').toUpperCase();

  if (normalizedStatus === 'PAID') {
    return {
      label: 'Paid',
      badgeClassName: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
      buttonClassName: 'border border-white/20 hover:border-amber-300 text-white',
      actionLabel: 'Mark Unpaid',
      nextStatus: 'UNPAID',
      showBadge: true,
    };
  }

  return {
    buttonClassName: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    actionLabel: 'Mark Paid',
    nextStatus: 'PAID',
    showBadge: false,
  };
}

function getExcelColumns() {
  return [
    { header: 'Date Registered', key: 'created_at', width: 24 },
    { header: 'First Name', key: 'first_name', width: 20 },
    { header: 'Last Name', key: 'last_name', width: 20 },
    { header: 'Preferred Name', key: 'preferred_name', width: 20 },
    { header: 'Phone', key: 'phone', width: 18 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Gender', key: 'gender', width: 14 },
    { header: 'Small Group Leader', key: 'small_group_leader', width: 26 },
    { header: 'Other Church', key: 'other_church', width: 30 },
    { header: 'Christian Duration', key: 'christian_duration', width: 22 },
    { header: 'Payment Method', key: 'payment_method', width: 20 },
    { header: 'Payment Status', key: 'payment_status', width: 18 },
    { header: 'Emergency Contact Name', key: 'emergency_contact_name', width: 26 },
    { header: 'Emergency Contact Number', key: 'emergency_contact_number', width: 24 },
    { header: 'Relationship', key: 'emergency_contact_relation', width: 16 },
  ];
}

const PAGE_SIZE = 10;

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sgLeaderFilter, setSgLeaderFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingPaymentId, setUpdatingPaymentId] = useState('');

  const formattedRecords = useMemo(
    () => records.map((item) => ({
      ...item,
      _createdDisplay: new Date(item.created_at).toLocaleString(),
      _paymentStatus: String(item.payment_status || 'UNPAID').toUpperCase(),
    })),
    [records],
  );

  const filterOptions = useMemo(() => {
    const genders = Array.from(new Set(
      records
        .map((item) => String(item.gender || '').trim())
        .filter(Boolean),
    ));

    const sgLeaders = Array.from(new Set(
      records
        .map((item) => String(item.small_group_leader || '').trim())
        .filter(Boolean),
    ));

    return {
      genders: genders.sort((a, b) => a.localeCompare(b)),
      sgLeaders: sgLeaders.sort((a, b) => a.localeCompare(b)),
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const normalizedSgLeader = sgLeaderFilter.trim().toLowerCase();

    return formattedRecords.filter((record) => {
      if (genderFilter !== 'all' && String(record.gender || '').toLowerCase() !== genderFilter.toLowerCase()) {
        return false;
      }

      if (normalizedSgLeader && String(record.small_group_leader || '').toLowerCase() !== normalizedSgLeader) {
        return false;
      }

      if (paymentStatusFilter !== 'all' && record._paymentStatus !== paymentStatusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      const searchableText = [
        record.first_name,
        record.last_name,
        record.preferred_name,
        record.phone,
        record.gender,
        record.small_group_leader,
        record.other_church,
        record.christian_duration,
        record.payment_method,
        record._paymentStatus,
        record.emergency_contact_name,
        record.emergency_contact_number,
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ');

      return searchableText.includes(normalizedQuery);
    });
  }, [formattedRecords, searchQuery, genderFilter, sgLeaderFilter, paymentStatusFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE)),
    [filteredRecords.length],
  );

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredRecords, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [records, searchQuery, genderFilter, sgLeaderFilter, paymentStatusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
    setSgLeaderFilter('');
    setPaymentStatusFilter('all');
  };

  const updatePaymentStatus = async (recordId, nextStatus) => {
    if (!token.trim() || !recordId) return;

    setUpdatingPaymentId(recordId);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-register-read-token': token,
        },
        body: JSON.stringify({
          id: recordId,
          payment_status: nextStatus,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to update payment status.');
      }

      setRecords((currentRecords) => currentRecords.map((record) => (
        String(record._id) === String(recordId)
          ? { ...record, ...payload.record }
          : record
      )));
    } catch (err) {
      setError(err?.message || 'Failed to update payment status.');
    } finally {
      setUpdatingPaymentId('');
    }
  };

  const exportExcel = async () => {
    if (!filteredRecords.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registrations', {
      views: [{ state: 'frozen', ySplit: 5 }],
    });

    worksheet.columns = getExcelColumns();
    worksheet.spliceRows(1, 0, [], [], [], []);

    const tableHeaderRowNumber = 5;
    const firstColumn = 'A';
    const lastColumn = worksheet.getColumn(worksheet.columns.length).letter;
    const titleRange = `${firstColumn}1:${lastColumn}1`;
    const subtitleRange = `${firstColumn}2:${lastColumn}2`;
    const listLabelRange = `${firstColumn}3:${lastColumn}3`;

    worksheet.mergeCells(titleRange);
    worksheet.mergeCells(subtitleRange);
    worksheet.mergeCells(listLabelRange);

    worksheet.getCell(`${firstColumn}1`).value = 'SUMMER RETREAT 2026';
    worksheet.getCell(`${firstColumn}2`).value = 'THE LIVING SAVIOUR CHRISTIAN FELLOWSHIP';
    worksheet.getCell(`${firstColumn}3`).value = `List of Registered Participants (${filteredRecords.length})`;

    worksheet.getRow(1).height = 28;
    worksheet.getRow(2).height = 22;
    worksheet.getRow(3).height = 20;
    worksheet.getRow(4).height = 8;

    worksheet.getCell(`${firstColumn}1`).font = {
      bold: true,
      size: 16,
      color: { argb: 'FF111827' },
      name: 'Calibri',
    };
    worksheet.getCell(`${firstColumn}1`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell(`${firstColumn}2`).font = {
      bold: true,
      size: 12,
      color: { argb: 'FF1F2937' },
      name: 'Calibri',
    };
    worksheet.getCell(`${firstColumn}2`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell(`${firstColumn}3`).font = {
      bold: true,
      size: 11,
      color: { argb: 'FF374151' },
      name: 'Calibri',
    };
    worksheet.getCell(`${firstColumn}3`).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.autoFilter = {
      from: { row: tableHeaderRowNumber, column: 1 },
      to: { row: tableHeaderRowNumber, column: worksheet.columns.length },
    };

    const headerRow = worksheet.getRow(tableHeaderRowNumber);
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
        first_name: record.first_name || '',
        last_name: record.last_name || '',
        preferred_name: record.preferred_name || '',
        phone: record.phone || '',
        age: record.age ?? '',
        gender: record.gender || '',
        small_group_leader: record.small_group_leader || '',
        other_church: record.other_church || '',
        christian_duration: record.christian_duration || '',
        payment_method: record.payment_method || '',
        payment_status: record._paymentStatus || 'UNPAID',
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
        if (rowNumber > tableHeaderRowNumber) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          cell.font = { color: { argb: 'FF111827' } };
        }
      });

      if (rowNumber > tableHeaderRowNumber) {
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
            <div className="w-full md:max-w-md flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3">
              <input
                type={showPassword ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent py-3 text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="inline-flex items-center justify-center text-slate-300 hover:text-amber-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
              disabled={!filteredRecords.length}
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
                <div className="lg:col-span-5 flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    placeholder="Search name, phone, church, SG leader, payment, emergency contact..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 rounded-xl font-semibold text-sm"
                  >
                    <Search size={14} /> Search
                  </button>
                </div>

                <div className="lg:col-span-2">
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

                <div className="lg:col-span-2">
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="all" className="text-slate-900">All Payments</option>
                    <option value="PAID" className="text-slate-900">Paid</option>
                    <option value="UNPAID" className="text-slate-900">Unpaid</option>
                  </select>
                </div>

                <div className="lg:col-span-3 flex gap-2">
                  <select
                    value={sgLeaderFilter}
                    onChange={(e) => setSgLeaderFilter(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-amber-400"
                  >
                    <option value="" className="text-slate-900">All SG Leaders</option>
                    {filterOptions.sgLeaders.map((leader) => (
                      <option key={leader} value={leader} className="text-slate-900">
                        {leader}
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
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-slate-300">
                    <tr>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">First Name</th>
                      <th className="text-left px-4 py-3">Last Name</th>
                      <th className="text-left px-4 py-3">Preferred</th>
                      <th className="text-left px-4 py-3">Phone</th>
                      <th className="text-left px-4 py-3">Age</th>
                      <th className="text-left px-4 py-3">Gender</th>
                      <th className="text-left px-4 py-3">SG Leader</th>
                      <th className="text-left px-4 py-3">Christian Duration</th>
                      <th className="text-left px-4 py-3">Payment Method</th>
                      <th className="text-left px-4 py-3">Payment Status</th>
                      <th className="text-left px-4 py-3">Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRecords.map((record) => {
                      const paymentStatusMeta = getPaymentStatusMeta(record._paymentStatus);

                      return (
                        <tr key={record._id} className="border-t border-white/10 hover:bg-white/5 transition-colors align-top">
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record._createdDisplay}</td>
                          <td className="px-4 py-3 text-white whitespace-nowrap">{record.first_name}</td>
                          <td className="px-4 py-3 text-white whitespace-nowrap">{record.last_name}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.preferred_name || '-'}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.phone}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.age}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.gender}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {record.small_group_leader}
                            {record.small_group_leader === 'FROM OTHER CHURCH' && record.other_church ? ` (${record.other_church})` : ''}
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.christian_duration || '-'}</td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{record.payment_method || '-'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {paymentStatusMeta.showBadge && (
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${paymentStatusMeta.badgeClassName}`}>
                                  {paymentStatusMeta.label}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => updatePaymentStatus(record._id, paymentStatusMeta.nextStatus)}
                                disabled={updatingPaymentId === String(record._id)}
                                className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${paymentStatusMeta.buttonClassName}`}
                              >
                                {updatingPaymentId === String(record._id) ? 'Updating...' : paymentStatusMeta.actionLabel}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                            {record.emergency_contact_name} ({record.emergency_contact_relation}) - {record.emergency_contact_number}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="px-5 md:px-6 py-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-slate-400">
                  Page {currentPage} of {totalPages} • {PAGE_SIZE} per page
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
