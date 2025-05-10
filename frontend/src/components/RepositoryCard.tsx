import React from 'react';
import '../components/repositoryCard.css'
import { RepositoryCardProps } from './RepositoryCard.types';

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repo }) => {
    return (
        <div className="repository-card">
            <h2>Repository name: {repo.name}</h2>
            <p>Description: {repo.description}</p>

            <div className="tags">
                {repo.tags && repo.tags.length > 0 && (
                    <div>
                        <span className="font-medium">Tags:</span>
                        {repo.tags.map((tag, index) => (
                            <span key={index}>{` ${tag}`}</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="language">
                {repo.language && (
                    <div>
                        <span className="font-medium">Language:</span>
                        <span>{repo.language}</span>
                    </div>
                )}
            </div>

            <div className="license">
                {repo.license && (
                    <div>
                        <span className="font-medium">License:</span>
                        <span>{repo.license}</span>
                    </div>
                )}
            </div>

            <div className="footer">
                <p>Created on: {new Date(repo.createdAt).toLocaleDateString()}</p>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">Go to Repository</a>
            </div>
        </div>
    );
};

export default RepositoryCard;
