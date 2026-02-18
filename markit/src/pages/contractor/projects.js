import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/seo';
import ContractorSidebar from '../../components/layout/ContractorSidebar';
import ProjectCard from '../../components/contractor/ProjectCard';
import ProgressUpdateForm from '../../components/contractor/ProgressUpdateForm';
import CreateProjectModal from '../../components/contractor/CreateProjectModal';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../utils/api';
import { IconBriefcase, IconSearch, IconPlus, IconCheck, IconClock } from '../../components/common/Icons';

const ContractorProjects = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'new'
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedProject, setSelectedProject] = useState(null); // For updates
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'contractor')) {
            router.push('/auth/contractor-login');
            return;
        }
        if (user && user.role === 'contractor') {
            fetchProjects();
        }
    }, [user, authLoading, router]);

    const fetchProjects = async () => {
        setLoading(true);
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

    const handleClaim = async (projectId) => {
        try {
            const res = await projectsAPI.claim(projectId);
            if (res.success) {
                alert('Project claimed successfully!');
                fetchProjects(); // Refresh list
            } else {
                alert(res.message || 'Failed to claim project');
            }
        } catch (err) {
            alert('Error claiming project');
        }
    };

    const activeProjects = projects.filter(p => (p.contractor?._id === user?._id || p.contractor === user?._id) && p.status !== 'Completed');
    const newProjects = projects.filter(p => !p.contractor && (p.status === 'Tender' || p.status === 'Planned'));

    const displayProjects = activeTab === 'active' ? activeProjects : newProjects;

    // Filter by search
    const filtered = displayProjects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <SEO pageTitle="My Projects - PETMS Contractor" />
            <div className="d-flex" style={{ backgroundColor: '#FFFBEB', minHeight: '100vh' }}>
                <ContractorSidebar />
                <main className="flex-grow-1" style={{ marginLeft: 260, padding: '24px 32px' }}>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#92400E' }}>
                                <IconBriefcase size={20} color="#F59E0B" /> Projects Management
                            </h4>
                            <p className="text-muted mb-0" style={{ fontSize: 14 }}>Manage your active work or find new opportunities</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="d-flex gap-2 mb-4 p-1 bg-white rounded-3 shadow-sm d-inline-flex">
                        <button
                            className={`btn btn-sm fw-medium ${activeTab === 'active' ? 'bg-warning text-dark' : 'text-muted'}`}
                            onClick={() => setActiveTab('active')}
                            style={{ minWidth: 120 }}
                        >
                            Active Projects ({activeProjects.length})
                        </button>
                        <button
                            className={`btn btn-sm fw-medium ${activeTab === 'new' ? 'bg-primary text-white' : 'text-muted'}`}
                            onClick={() => setActiveTab('new')}
                            style={{ minWidth: 120 }}
                        >
                            New Opportunities ({newProjects.length})
                        </button>
                    </div>

                    {/* Search and Action */}
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <div className="input-group shadow-sm border-0" style={{ maxWidth: 300, borderRadius: 8, overflow: 'hidden' }}>
                            <span className="input-group-text bg-white border-0 ps-3"><IconSearch size={16} color="#9CA3AF" /></span>
                            <input
                                className="form-control border-0 bg-white"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ fontSize: 14 }}
                            />
                        </div>
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                            onClick={() => setShowCreateModal(true)}
                            style={{ borderRadius: 8 }}
                        >
                            <IconPlus size={18} /> Create Project
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {filtered.length > 0 ? filtered.map((project) => (
                                <div key={project._id || project.id} className="col-md-6 col-lg-4">
                                    <div className="h-100 d-flex flex-column">
                                        <ProjectCard project={{
                                            ...project,
                                            location: typeof project.location === 'object' ? project.location.city || project.location.address : project.location,
                                            endDate: project.expectedEndDate,
                                        }} />

                                        {project.approvalStatus === 'Pending' && (
                                            <div className="mt-2 text-center">
                                                <span className="badge bg-warning text-dark w-100 py-2">
                                                    <IconClock size={14} className="me-1" /> Pending Approval
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-2">
                                            {activeTab === 'active' ? (
                                                <button
                                                    className="btn w-100 fw-medium shadow-sm"
                                                    style={{ backgroundColor: project.approvalStatus === 'Pending' ? '#E5E7EB' : '#F59E0B', color: project.approvalStatus === 'Pending' ? '#9CA3AF' : '#fff', border: 'none', borderRadius: 8 }}
                                                    onClick={() => setSelectedProject(project)}
                                                    disabled={project.approvalStatus === 'Pending'}
                                                >
                                                    {project.approvalStatus === 'Pending' ? 'Awaiting Approval' : 'Update Progress'}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn w-100 fw-medium shadow-sm d-flex align-items-center justify-content-center gap-2"
                                                    style={{ backgroundColor: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8 }}
                                                    onClick={() => handleClaim(project._id || project.id)}
                                                >
                                                    <IconPlus size={16} /> Take Project
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-12 text-center py-5 text-muted">
                                    <p>No projects found in this category.</p>
                                    {activeTab === 'active' && (
                                        <button className="btn btn-link" onClick={() => setShowCreateModal(true)}>Create your first project</button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </main>

                {/* Create Project Modal */}
                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={() => {
                            fetchProjects();
                            setActiveTab('active');
                        }}
                    />
                )}

                {/* Update Modal Placeholder */}
                {selectedProject && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                        <div className="bg-white rounded-4 shadow-lg p-0 overflow-hidden" style={{ maxWidth: 600, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h6 className="mb-0 fw-bold">Update Progress: {selectedProject.title}</h6>
                                <button className="btn-close" onClick={() => setSelectedProject(null)}></button>
                            </div>
                            <div className="p-4">
                                <ProgressUpdateForm projectId={selectedProject._id || selectedProject.id} onSuccess={() => {
                                    setSelectedProject(null);
                                    fetchProjects();
                                }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ContractorProjects;
