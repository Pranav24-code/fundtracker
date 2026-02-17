import React from 'react';
import { IconClock } from '../common/Icons';

const timelineData = [
    { id: 1, project: 'NH-44 Road Widening', message: 'Completion: 65% → 72%', detail: '3 photos uploaded', time: '2 hours ago', status: 'approved', color: '#10B981' },
    { id: 2, project: 'AIIMS Nagpur Construction', message: 'Completion: 50% → 55%', detail: 'Amount spent: +₹5 Cr', time: '2 days ago', status: 'pending', color: '#F59E0B' },
    { id: 3, project: 'Smart City Bhopal - Phase 1', message: 'Completion: 60% → 65%', detail: '5 photos uploaded', time: '5 days ago', status: 'approved', color: '#10B981' },
    { id: 4, project: 'Mumbai-Pune Expressway Phase 2', message: 'Completion: 65% → 70%', detail: 'Bridge work documentation', time: '1 week ago', status: 'approved', color: '#10B981' },
];

const UpdatesTimeline = () => {
    return (
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body p-4">
                <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><IconClock size={16} color="#6B7280" /> Recent Updates</h6>
                <div className="position-relative">
                    {/* Vertical line */}
                    <div style={{ position: 'absolute', left: 10, top: 8, bottom: 8, width: 2, backgroundColor: '#E5E7EB' }}></div>

                    {timelineData.map((item) => (
                        <div key={item.id} className="d-flex gap-3 mb-4 position-relative">
                            <div className="flex-shrink-0" style={{ zIndex: 1 }}>
                                <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: item.color, border: '3px solid #fff', boxShadow: '0 0 0 2px ' + item.color + '40' }}></div>
                            </div>
                            <div className="flex-grow-1" style={{ marginTop: -2 }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <div className="fw-semibold" style={{ fontSize: 14 }}>{item.project}</div>
                                        <div style={{ fontSize: 13, color: '#374151' }}>{item.message}</div>
                                        <small className="text-muted">{item.detail}</small>
                                    </div>
                                    <div className="text-end">
                                        <small className="text-muted d-block" style={{ fontSize: 11 }}>{item.time}</small>
                                        <span className={`badge rounded-pill mt-1 ${item.status === 'approved' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: 10 }}>
                                            {item.status === 'approved' ? '✓ Approved' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UpdatesTimeline;
