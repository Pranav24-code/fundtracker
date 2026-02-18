import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '../../components/seo';
import Navbar from '../../components/layout/CitizenNavbar';
import Footer from '../../components/layout/Footer';
import { projectsAPI } from '../../utils/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IconMapPin, IconBuilding, IconArrowRight, IconCalendar, IconUser, IconAlertTriangle } from '../../components/common/Icons';

const ProjectDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const projectRes = await projectsAPI.getOne(id);
                if (projectRes.success) {
                    setProject(projectRes.data.project);
                } else {
                    setError('Failed to load project details');
                }

                const updatesRes = await projectsAPI.getUpdates(id);
                if (updatesRes.success) {
                    setUpdates(updatesRes.data.updates);
                }
            } catch (err) {
                console.error('Error fetching project data:', err);
                setError('Failed to load project data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <Footer />
        </div>
    );

    if (error || !project) return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center p-4">
                <IconAlertTriangle size={48} color="#EF4444" className="mb-3" />
                <h3 className="text-secondary">Project Not Found</h3>
                <p className="text-muted">{error || 'The requested project could not be found.'}</p>
                <Link href="/citizen/dashboard">
                    <a className="btn btn-primary mt-3">Back to Dashboard</a>
                </Link>
            </div>
            <Footer />
        </div>
    );

    const themeColor = project.status === 'Delayed' ? '#EF4444' : '#059669';

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            <SEO pageTitle={`${project.title} - Project Details`} />
            <Navbar />

            <main className="flex-grow-1 container py-5">
                {/* Header Section */}
                <div className="mb-4">
                    <Link href="/citizen/dashboard">
                        <a className="text-decoration-none text-muted small hover-opacity mb-2 d-inline-block">← Back to Dashboard</a>
                    </Link>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1">
                                    {project.department}
                                </span>
                                {project.riskFlag && (
                                    <span className="badge bg-danger rounded-pill px-3 py-1">
                                        Critical Risk
                                    </span>
                                )}
                            </div>
                            <h1 className="fw-bold text-dark mb-1">{project.title}</h1>
                            <p className="text-muted d-flex align-items-center gap-2 mb-0">
                                <IconMapPin size={18} />
                                {typeof project.location === 'object'
                                    ? `${project.location.address}, ${project.location.city}`
                                    : project.location}
                            </p>
                        </div>
                        <div className="text-end">
                            <span className="badge fs-6 px-4 py-2 rounded-pill shadow-sm"
                                style={{
                                    backgroundColor: project.status === 'Delayed' ? '#FEF2F2' : '#ECFDF5',
                                    color: themeColor,
                                    border: `1px solid ${themeColor}20`
                                }}>
                                {project.status === 'Delayed' ? '⚠ Delayed' : project.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Project Stats & Info */}
                    <div className="col-lg-8">
                        {/* Progress Card */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Project Progress</h5>
                                <div className="mb-2 d-flex justify-content-between align-items-end">
                                    <span className="display-4 fw-bold text-primary">{project.completionPercentage}%</span>
                                    <span className="text-muted mb-2">Completed</span>
                                </div>
                                <div className="progress mb-4" style={{ height: 12, borderRadius: 10, backgroundColor: '#E5E7EB' }}>
                                    <div className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style={{
                                            width: `${project.completionPercentage}%`,
                                            backgroundColor: themeColor
                                        }}
                                    ></div>
                                </div>

                                <div className="row g-4 pt-3 border-top">
                                    <div className="col-md-4">
                                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: 11 }}>Total Budget</small>
                                        <div className="fs-5 fw-bold text-dark">{formatCurrency(project.totalBudget)}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: 11 }}>Amount Spent</small>
                                        <div className="fs-5 fw-bold text-dark">{formatCurrency(project.amountSpent)}</div>
                                    </div>
                                    <div className="col-md-4">
                                        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: 11 }}>Start Date</small>
                                        <div className="fs-5 fw-bold text-dark">{formatDate(project.startDate)}</div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h6 className="fw-bold mb-2">Description</h6>
                                    <p className="text-muted">{project.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Updates Timeline */}
                        <h5 className="fw-bold mb-3 px-1">Recent Updates</h5>
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                {updates.length > 0 ? (
                                    <div className="timeline">
                                        {updates.map((update, index) => (
                                            <div key={update._id} className="timeline-item pb-4 position-relative ps-4 border-start border-2 border-light">
                                                <div className="position-absolute top-0 start-0 translate-middle bg-white border border-2 rounded-circle mt-1"
                                                    style={{ width: 12, height: 12, borderColor: '#3B82F6' }}></div>

                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="fw-bold text-dark">Progress Update</span>
                                                    <small className="text-muted">{formatDate(update.createdAt)}</small>
                                                </div>
                                                <p className="small text-muted mb-2">{update.description}</p>

                                                {/* Photos if any */}
                                                {update.photos && update.photos.length > 0 && (
                                                    <div className="d-flex gap-2 mt-2 overflow-auto pb-2">
                                                        {update.photos.map((photo, i) => (
                                                            <div key={i} className="rounded-3 overflow-hidden border" style={{ minWidth: 100, width: 100, height: 80 }}>
                                                                <img src={photo.url} alt="Update" className="w-100 h-100 object-fit-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="mt-2">
                                                    <span className="badge bg-light text-secondary border">
                                                        {update.progressPercentage}% Complete
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 text-muted">
                                        <IconCalendar size={32} className="mb-2 opacity-50" />
                                        <p>No updates submitted yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="col-lg-4">
                        {/* Contractor Card */}
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h6 className="text-uppercase text-muted fw-bold small mb-3">Contractor Information</h6>
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                                        <IconBuilding size={24} className="text-secondary" />
                                    </div>
                                    <div>
                                        <div className="fw-bold">{project.contractor?.organization || project.contractor?.name || 'Not Assigned'}</div>
                                        <div className="small text-muted">Assigned Contractor</div>
                                    </div>
                                </div>
                                <hr className="border-light" />
                                {project.contractor ? (
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Contact Person:</span>
                                            <span className="fw-medium">{project.contractor.name}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Email:</span>
                                            <span className="fw-medium text-break">{project.contractor.email}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-muted">Phone:</span>
                                            <span className="fw-medium">{project.contractor.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="alert alert-warning small mb-0">
                                        No contractor assigned to this project yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Map Placeholder */}
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="card-body p-0">
                                <iframe
                                    width="100%"
                                    height="250"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(typeof project.location === 'object' ? `${project.location.address},${project.location.city}` : project.location)}&z=15&output=embed`}
                                    allowFullScreen
                                ></iframe>
                                <div className="p-3">
                                    <h6 className="fw-bold mb-1">Location Details</h6>
                                    <p className="small text-muted mb-0">
                                        {typeof project.location === 'object'
                                            ? `${project.location.address}, ${project.location.city}`
                                            : project.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProjectDetails;
