import React, { useState, useEffect } from 'react';
import SEO from '../../components/seo';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ProjectsTable from '../../components/admin/ProjectsTable';
import { IconFolder } from '../../components/common/Icons';
import { projectsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const AdminProjects = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
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
    }, [user, authLoading, router]);

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll({ limit: 100 });
            if (res.success) {
                setProjects(res.data.projects);
            }
        } catch (err) {
            console.error('Failed to fetch projects', err);
        }
        setLoading(false);
    };

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
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                        </div>
                    ) : (
                        <ProjectsTable projects={projects} />
                    )}
                </main>
            </div>
        </>
    );
};

export default AdminProjects;
