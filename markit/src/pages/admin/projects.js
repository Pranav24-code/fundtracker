import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ProjectsTable from '../../components/admin/ProjectsTable';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../utils/api';
import { IconFolder } from '../../components/common/Icons';

const AdminProjects = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/auth/admin-login');
            return;
        }
        if (user && user.role === 'admin') {
            fetchProjects();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll({ limit: 50 });
            if (res.success) setProjects(res.data.projects);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    return (
        <>
            <SEO pageTitle="All Projects - PETMS Admin" />
            <div className="d-flex" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <AdminSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>
                    <div className="mb-4">
                        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                            <IconFolder size={20} color="#3B82F6" /> All Projects
                        </h4>
                        <p className="text-muted" style={{ fontSize: 14 }}>Manage and monitor all government projects</p>
                    </div>
                    <ProjectsTable projects={projects} />
                </main>
            </div>
        </>
    );
};

export default AdminProjects;
