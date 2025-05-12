export interface RepositoryCardProps {
    repo: {
        name: string;
        description: string;
        language: string;
        license: string;
        url: string;
        createdAt: string;
        updatedAt: string;
        tags: string[];
        stars: number;
        forks: number;
        issues: number;
        size: number;
    };
}