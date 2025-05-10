import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import gitIcon from '../assets/Github-Logo.png';
import { languageOptions } from '../utils/languageOptions';
import { licenceOptions } from '../utils/licenceOptions';
import { tagOptions } from '../utils/tagOptions';
import RepositoryCard from '../components/RepositoryCard';

function MainPage() {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null] | undefined>(undefined);
    const [license, setLicense] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearched, setIsSearched] = useState(false);

    const handleSearch = () => {
        fetch('http://localhost:8080/api/repositories/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                tags,
                languages,
                license,
                dateRange
            }),
        })
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setIsSearched(true);
            })
            .catch(error => console.error('Error fetching search results:', error));
    };

    return (
        <div className="p-4" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <div className="flex align-items-center mb-4">
                <img src={gitIcon} alt="Git Icon" width={80} height={80} />
            </div>

            <div className="grid formgrid p-fluid">
                <div className="col-12 md:col-3">
                    <label htmlFor="title">Title</label>
                    <InputText id="title" placeholder="Enter repository title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="col-12 md:col-3">
                    <label htmlFor="tags">Tags</label>
                    <MultiSelect
                        id="tags"
                        value={tags}
                        options={tagOptions}
                        onChange={(e) => setTags(e.value)}
                        placeholder="Select tags"
                        filter
                    />
                </div>

                <div className="col-12 md:col-3">
                    <label htmlFor="languages">Programming Languages</label>
                    <MultiSelect
                        id="languages"
                        value={languages}
                        options={languageOptions}
                        onChange={(e) => setLanguages(e.value)}
                        placeholder="Select languages"
                        filter
                    />
                </div>

                <div className="col-12 md:col-3">
                    <label htmlFor="dateRange">Date Range</label>
                    <Calendar
                        id="dateRange"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.value as [Date | null, Date | null])}
                        selectionMode="range"
                        readOnlyInput
                        placeholder="Select date range"
                        showIcon
                    />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="license">License</label>
                    <MultiSelect
                        id="license"
                        value={license}
                        options={licenceOptions}
                        onChange={(e) => setLicense(e.value)}
                        placeholder="Select licenses"
                        filter
                    />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="description">Repository Description</label>
                    <InputTextarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        autoResize
                    />
                </div>
                <div className="col-12 mt-3" style={{ margin: '0 auto' }}>
                    <Button
                        label="Search"
                        style={{ backgroundColor: 'black', border: 'none', borderRadius: '8px' }}
                        onClick={handleSearch}
                    />
                </div>
                {isSearched && (
                    <>
                        <div className="overflow-y-auto max-h-[70vh] pr-2 mt-4">
                            {results.length > 0 ? (
                                results.map((repo, index) => (
                                    <RepositoryCard key={index} repo={repo} />
                                ))
                            ) : (
                                <div>No results found</div>
                            )}
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            Total results: {results.length}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MainPage;