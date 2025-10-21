import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../services/api';
import { Lesson, Maintenance, Car, Truck, Bus, Motorcycle } from '../types';
import { useTranslation } from '../i18n/i18n';
import { useSchool } from '../contexts/SchoolContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

type Vehicle = (Car | Truck | Bus | Motorcycle) & { type: 'car' | 'truck' | 'bus' | 'motorcycle' };
type CalendarEvent = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    title: string;
    type: 'lesson' | 'maintenance';
    vehicle: Vehicle;
};

const vehicleTypes = ['car', 'truck', 'bus', 'motorcycle'] as const;
type VehicleType = typeof vehicleTypes[number];

const CalendarView: React.FC = () => {
    const { t } = useTranslation();
    const { selectedOffice } = useSchool();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<Record<VehicleType, boolean>>({ car: true, truck: true, bus: true, motorcycle: true });

    const fetchData = useCallback(async () => {
        if (!selectedOffice?.id) return;
        setLoading(true);

        try {
            const [lessons, maintenance, cars, trucks, buses, motorcycles] = await Promise.all([
                apiService.getLessons(selectedOffice.id),
                apiService.getAllMaintenance(),
                apiService.getCars(),
                apiService.getTrucks(),
                apiService.getBuses(),
                apiService.getMotorcycles(),
            ]);

            const allVehicles: Vehicle[] = [
                ...cars.map(v => ({ ...v, type: 'car' as const })),
                ...trucks.map(v => ({ ...v, type: 'truck' as const })),
                ...buses.map(v => ({ ...v, type: 'bus' as const })),
                ...motorcycles.map(v => ({ ...v, type: 'motorcycle' as const })),
            ];
            
            const vehicleMap = new Map(allVehicles.map(v => [v.id, v]));

            const lessonEvents: CalendarEvent[] = lessons
                .filter(l => l.status === 'scheduled' && vehicleMap.has(l.carId)) // Note: lessons are only for cars in mock data
                .map(l => ({
                    id: `l-${l.id}`,
                    date: l.date,
                    startTime: l.startTime,
                    endTime: l.endTime,
                    title: `${t('calendar.lesson')} - ${l.studentName}`,
                    type: 'lesson',
                    vehicle: vehicleMap.get(l.carId)!,
                }));
            
            const maintenanceEvents: CalendarEvent[] = maintenance
                .filter(m => m.status === 'scheduled' && vehicleMap.has(m.vehicleId))
                .map(m => ({
                    id: `m-${m.id}`,
                    date: m.date,
                    startTime: '00:00',
                    endTime: '23:59',
                    title: `${t('calendar.maintenance')} - ${m.description}`,
                    type: 'maintenance',
                    vehicle: vehicleMap.get(m.vehicleId)!,
                }));
            
            setEvents([...lessonEvents, ...maintenanceEvents]);
        } catch (error) {
            console.error("Failed to fetch calendar data", error);
        } finally {
            setLoading(false);
        }
    }, [selectedOffice, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (type: VehicleType) => {
        setFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const filteredEvents = useMemo(() => {
        const activeFilters = Object.entries(filters).filter(([,v]) => v).map(([k]) => k);
        return events.filter(event => activeFilters.includes(event.vehicle.type));
    }, [events, filters]);

    const eventsByDate = useMemo(() => {
        return filteredEvents.reduce((acc, event) => {
            (acc[event.date] = acc[event.date] || []).push(event);
            return acc;
        }, {} as Record<string, CalendarEvent[]>);
    }, [filteredEvents]);

    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const calendarDays = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        calendarDays.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const vehicleEmojis: Record<VehicleType, string> = { car: '🚗', truck: '🚚', bus: '🚌', motorcycle: '🏍️' };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">{t('calendar.title')}</h1>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon/></button>
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 w-40 text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon/></button>
                    </div>
                    <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('calendar.filterByVehicle')}</span>
                        {vehicleTypes.map(type => (
                            <label key={type} className="flex items-center space-x-2 cursor-pointer text-sm">
                                <input type="checkbox" checked={filters[type]} onChange={() => handleFilterChange(type)} className="rounded text-[rgb(var(--color-primary-600))] focus:ring-[rgb(var(--color-primary-500))]" />
                                <span className="text-gray-700 dark:text-gray-200 capitalize">{t(`calendar.${type}s`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="py-3">{day}</div>)}
                </div>
                {loading ? <div className="text-center p-20 text-gray-500">Loading...</div> : (
                <div className="grid grid-cols-7 h-[70vh]">
                    {calendarDays.map(date => {
                        const dateString = date.toISOString().split('T')[0];
                        const dayEvents = eventsByDate[dateString] || [];
                        return (
                            <div key={dateString} className={`border-r border-b dark:border-gray-700 p-2 flex flex-col ${date.getMonth() !== currentDate.getMonth() ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                                <span className={`font-semibold ${isToday(date) ? 'bg-[rgb(var(--color-primary-600))] text-white rounded-full w-7 h-7 flex items-center justify-center' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {date.getDate()}
                                </span>
                                <div className="mt-1 space-y-1 overflow-y-auto flex-grow">
                                    {dayEvents.sort((a,b) => a.startTime.localeCompare(b.startTime)).map(event => (
                                        <div key={event.id} className={`p-1.5 rounded-md text-xs ${event.type === 'lesson' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200'}`}>
                                            <p className="font-bold truncate">{vehicleEmojis[event.vehicle.type]} {event.vehicle.make} {event.vehicle.model}</p>
                                            <p className="truncate">{event.title}</p>
                                            <p className="opacity-80">{event.startTime === '00:00' && event.endTime === '23:59' ? 'All Day' : `${event.startTime} - ${event.endTime}`}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
                )}
            </div>
        </div>
    );
};

export default CalendarView;