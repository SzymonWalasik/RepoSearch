export interface RepositoryCardProps {
    repo: {
        name: string;
        description: string;
        language: string;
        license: string;
        url: string;
        createdAt: string;
        tags: string[];
        stars: number;
        forks: number;
    };
}