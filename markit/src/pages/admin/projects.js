import React from 'react';
import SEO from '../../components/seo';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ProjectsTable from '../../components/admin/ProjectsTable';
import { IconFolder } from '../../components/common/Icons';

const AdminProjects = () => {
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
                    <ProjectsTable />
                </main>
            </div>
        </>
    );
};

export default AdminProjects;
