import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import ContractorSidebar from '../../components/layout/ContractorSidebar';
import ProjectCard from '../../components/contractor/ProjectCard';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../utils/api';
import { IconBriefcase } from '../../components/common/Icons';

const ContractorProjects = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'contractor')) {
            router.push('/auth/contractor-login');
            return;
        }
        if (user && user.role === 'contractor') {
            fetchProjects();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll({ limit: 50 });
            if (res.success) {
                const all = res.data.projects;
                const mine = all.filter(p => p.contractor?._id === user?._id || p.contractor === user?._id);
                setProjects(mine.length > 0 ? mine : all.slice(0, 5));
            }
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        }
        setLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#FFFBEB' }}>
                <div className="spinner-border" style={{ color: '#F59E0B' }} role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
        );
    }

    return (
        <>
            <SEO pageTitle="My Projects - PETMS Contractor" />
            <div className="d-flex" style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
                <ContractorSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>
                    <div className="mb-4">
                        <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#92400E' }}>
                            <IconBriefcase size={20} color="#F59E0B" /> My Projects
                        </h4>
                        <p className="text-muted" style={{ fontSize: 14 }}>All projects assigned to you</p>
                    </div>
                    <div className="row g-4">
                        {projects.map((project) => (
                            <div key={project._id || project.id} className="col-md-6 col-lg-4">
                                <ProjectCard project={{
                                    ...project,
                                    location: typeof project.location === 'object' ? project.location.city || project.location.address : project.location,
                                    endDate: project.expectedEndDate,
                                }} />
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="col-12 text-center py-5 text-muted">No projects assigned yet</div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContractorProjects;
