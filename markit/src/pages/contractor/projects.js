import React from 'react';
import SEO from '../../components/seo';
import ContractorSidebar from '../../components/layout/ContractorSidebar';
import ProjectCard from '../../components/contractor/ProjectCard';
import projectData from '../../data/projectData';
import { IconBriefcase } from '../../components/common/Icons';

const ContractorProjects = () => {
    const myProjects = projectData.slice(0, 5);

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
                        {myProjects.map((project) => (
                            <div key={project.id} className="col-md-6 col-lg-4">
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContractorProjects;
