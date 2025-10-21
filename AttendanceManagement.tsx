import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../i18n/i18n';
import { apiService } from '../services/api';
import { Student, Staff, Attendance } from '../types';
import { useSchool } from '../contexts/SchoolContext';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

const AttendanceManagement: React.FC = () => {
    const { t } = useTranslation();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [tab, setTab] = useState<'students' | 'staff'>('students');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [attendance, setAttendance] = useState<Map<string, 'present' | 'absent'>>(new Map());
    const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const { selectedOffice } = useSchool();

    const fetchData = useCallback(async () => {
        if (!selectedOffice?.id) return;
        setLoading(true);
        setSaveStatus(null);

        try {
            const [studentsData, staffData, attendanceData] = await Promise.all([
                apiService.getStudents(selectedOffice.id),
                apiService.getStaff(),
                apiService.getAttendance(date, selectedOffice.id)
            ]);

            setStudents(studentsData);
            setStaff(staffData);

            const newAttendance = new Map<string, 'present' | 'absent'>();
            studentsData.forEach(s => newAttendance.set(s.id, 'absent'));
            staffData.forEach(s => newAttendance.set(s.id, 'absent'));
            attendanceData.forEach(att => newAttendance.set(att.entityId, att.status));
            
            setAttendance(newAttendance);
        } catch (error) {
            console.error("Failed to fetch attendance data", error);
            setSaveStatus({ message: 'Failed to load data.', type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [date, selectedOffice]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = (entityId: string, status: 'present' | 'absent') => {
        setAttendance(prev => new Map(prev).set(entityId, status));
    };

    const handleSave = async () => {
        if (!selectedOffice?.id) return;
        setSaving(true);
        setSaveStatus(null);

        const attendancePayload: Omit<Attendance, 'id'>[] = [];
        students.forEach(student => {
            attendancePayload.push({ entityId: student.id, entityType: 'student', date, status: attendance.get(student.id) || 'absent' });
        });
        staff.forEach(s => {
            attendancePayload.push({ entityId: s.id, entityType: 'staff', date, status: attendance.get(s.id) || 'absent' });
        });
        
        try {
            await apiService.markAttendance(attendancePayload);
            setSaveStatus({ message: `Attendance for ${date} saved successfully!`, type: 'success' });
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (e) {
            console.error(e);
            setSaveStatus({ message: 'Failed to save attendance.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    // FIX: Define props interface and use React.FC to correctly type the component for TSX, resolving issues with the 'key' prop.
    interface AttendanceRowProps {
        entity: Student | Staff;
        type: 'student' | 'staff';
    }

    const AttendanceRow: React.FC<AttendanceRowProps> = ({ entity, type }) => {
        const status = attendance.get(entity.id) || 'absent';
        return (
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <img 
                        src={`https://i.pravatar.cc/150?u=${entity.id}`} 
                        alt={entity.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{entity.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{type === 'student' ? (entity as Student).licenseCategory : (entity as Staff).role}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleStatusChange(entity.id, 'present')} className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center transition-colors ${status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/50'}`}>
                        <CheckCircleIcon />
                        <span className="ml-2">Present</span>
                    </button>
                    <button onClick={() => handleStatusChange(entity.id, 'absent')} className={`px-4 py-2 rounded-md font-semibold text-sm flex items-center transition-colors ${status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/50'}`}>
                        <XCircleIcon />
                        <span className="ml-2">Absent</span>
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Attendance</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div>
                    <label htmlFor="attendance-date" className="text-sm font-medium text-gray-600 dark:text-gray-300">Select Date:</label>
                    <input 
                        type="date"
                        id="attendance-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="ml-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-[rgb(var(--color-primary-500))]"
                    />
                </div>
                 <div className="flex space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                    <button onClick={() => setTab('students')} className={`px-4 py-2 text-sm font-semibold rounded-md ${tab === 'students' ? 'bg-white dark:bg-gray-700 text-[rgb(var(--color-primary-600))] shadow' : 'text-gray-600 dark:text-gray-400'}`}>Students</button>
                    <button onClick={() => setTab('staff')} className={`px-4 py-2 text-sm font-semibold rounded-md ${tab === 'staff' ? 'bg-white dark:bg-gray-700 text-[rgb(var(--color-primary-600))] shadow' : 'text-gray-600 dark:text-gray-400'}`}>Staff</button>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center p-10">Loading...</div>
            ) : (
                <div className="space-y-4">
                    {tab === 'students' && (
                        students.length > 0 
                            ? students.map(s => <AttendanceRow key={s.id} entity={s} type="student" />)
                            : <p className="text-center text-gray-500 dark:text-gray-400 p-4">No students found for this office.</p>
                    )}
                    {tab === 'staff' && (
                         staff.length > 0 
                            ? staff.map(s => <AttendanceRow key={s.id} entity={s} type="staff" />)
                            : <p className="text-center text-gray-500 dark:text-gray-400 p-4">No staff found.</p>
                    )}
                </div>
            )}
            
            <div className="mt-8 flex justify-end items-center">
                {saveStatus && (
                    <span className={`mr-4 text-sm font-medium ${saveStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {saveStatus.message}
                    </span>
                )}
                <button 
                    onClick={handleSave} 
                    disabled={saving || loading}
                    className="px-6 py-3 font-semibold text-white bg-[rgb(var(--color-primary-600))] rounded-lg hover:bg-[rgb(var(--color-primary-700))] disabled:bg-[rgb(var(--color-primary-400))] disabled:cursor-not-allowed transition-colors"
                >
                    {saving ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>
        </div>
    );
};

export default AttendanceManagement;