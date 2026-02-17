import React, { useState, useEffect } from 'react';
import SEO from '../../components/seo';
import CitizenNavbar from '../../components/layout/CitizenNavbar';
import Footer from '../../components/layout/Footer';
import MyComplaints from '../../components/citizen/MyComplaints';
import ComplaintForm from '../../components/citizen/ComplaintForm';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI, projectsAPI } from '../../utils/api';
import { IconClipboard } from '../../components/common/Icons';

const CitizenComplaints = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, isAuthenticated]);

    const fetchData = async () => {
        try {
            const projRes = await projectsAPI.getAll({ limit: 50 });
            if (projRes.success) setProjects(projRes.data.projects);

            if (isAuthenticated) {
                const compRes = await complaintsAPI.getAll({ limit: 50 });
                if (compRes.success) setComplaints(compRes.data.complaints);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
        setLoading(false);
    };

    return (
        <>
            <SEO pageTitle="My Complaints - PETMS Citizen" />
            <CitizenNavbar />
            <div className="py-5" style={{ backgroundColor: '#F9FAFB', minHeight: '80vh' }}>
                <div className="container">
                    <div className="mb-4">
                        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                            <IconClipboard size={20} color="#10B981" /> My Complaints & Reports
                        </h4>
                        <p className="text-muted" style={{ fontSize: 14 }}>Track status of your submitted complaints</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-7">
                            <MyComplaints complaints={complaints} loading={loading} />
                        </div>
                        <div className="col-lg-5">
                            <ComplaintForm projects={projects} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CitizenComplaints;
