import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const generateRandomHolidays = (year: number, month: number) => {
  const holidays = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const numHolidays = Math.floor(Math.random() * 3) + 2; // 2 to 4 random days
  
  for (let i = 0; i < numHolidays; i++) {
    const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
    holidays.push(new Date(year, month, randomDay));
  }
  return holidays;
};

const CalendarSection = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [holidays, setHolidays] = useState<Date[]>([]);

  useEffect(() => {
    setHolidays(generateRandomHolidays(currentMonth.getFullYear(), currentMonth.getMonth()));
  }, [currentMonth]);

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button className="liquid-glass" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex' }} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft />
        </button>
        <h2 style={{ fontSize: '2rem', textTransform: 'capitalize', margin: 0 }}>
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <button className="liquid-glass" style={{ padding: '0.75rem', borderRadius: '50%', display: 'flex' }} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDate = startOfWeek(currentMonth, { locale: es });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize', padding: '1rem 0' }}>
          {format(addDays(startDate, i), dateFormat, { locale: es }).substring(0, 3)}
        </div>
      );
    }
    return <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: es });
    const endDate = endOfWeek(monthEnd, { locale: es });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isHoliday = holidays.some(h => isSameDay(h, cloneDay)) || i === 0 || i === 6; // random holidays + weekends
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            className={`calendar-day-lite ${!isCurrentMonth ? 'disabled' : ''}`}
            key={day.toString()}
            style={{ 
              flex: 1, 
              minHeight: '100px', 
              padding: '0.5rem', 
              opacity: isCurrentMonth ? 1 : 0.4,
              border: '1px solid rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              background: isHoliday && isCurrentMonth ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255, 0.01)',
              borderColor: isHoliday && isCurrentMonth ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.02)'
            }}
          >
            <span style={{ 
              fontSize: '1.2rem', 
              fontWeight: 600, 
              color: isHoliday && isCurrentMonth ? '#fca5a5' : 'var(--text)',
              marginBottom: 'auto'
            }}>{formattedDate}</span>
            {isHoliday && isCurrentMonth && (
              <span style={{ fontSize: '0.75rem', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px', textAlign: 'center', marginTop: '0.5rem' }}>
                Sin Clases
              </span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div style={{ display: 'flex', width: '100%', gap: '0.5rem', marginBottom: '0.5rem' }} key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem' }}>Calendario Escolar</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Revisá los días de clases y asueto administrativo.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="liquid-glass-strong hover-glass" style={{ padding: '2rem', borderRadius: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ maxWidth: '1000px', margin: '2rem auto 0', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <div className="liquid-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem 1rem', borderRadius: '100px', color: '#fca5a5' }}>
          <Info size={16} /> Feriados y Fin de semana marcados en rojo
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarSection;
