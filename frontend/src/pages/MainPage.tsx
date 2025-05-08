import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import gitIcon from '../assets/Github-Logo.png';

function MainPage() {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [license, setLicense] = useState<string[]>([]);
    const [description, setDescription] = useState('');

    const handleSearch = () => {
        console.log({
            title,
            tags,
            languages,
            dateRange,
            license,
            description
        });
    };

    const dummyOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
    ];

    return (
        <div className="p-4" style={{ backgroundColor: 'white', minHeight: '100vh' }}>
            <div className="flex align-items-center mb-4">
                <img src={gitIcon} alt="Git Icon" width={80} height={80} />
            </div>

            <div className="grid formgrid p-fluid">
                <div className="col-12 md:col-3">
                    <label htmlFor="title">Title</label>
                    <InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="col-12 md:col-3">
                    <label htmlFor="tags">Tags</label>
                    <MultiSelect
                        id="tags"
                        value={tags}
                        options={dummyOptions}
                        onChange={(e) => setTags(e.value)}
                        placeholder="Select tags"
                    />
                </div>

                <div className="col-12 md:col-3">
                    <label htmlFor="languages">Programming Languages</label>
                    <MultiSelect
                        id="languages"
                        value={languages}
                        options={dummyOptions}
                        onChange={(e) => setLanguages(e.value)}
                        placeholder="Select languages"
                    />
                </div>

                <div className="col-12 md:col-3">
                    <label htmlFor="dateRange">Date Range</label>
                    <Calendar
                        id="dateRange"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.value as [Date, Date])}
                        selectionMode="range"
                        readOnlyInput
                        placeholder="Select date range"
                    />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="license">License</label>
                    <MultiSelect
                        id="license"
                        value={license}
                        options={dummyOptions}
                        onChange={(e) => setLicense(e.value)}
                        placeholder="Select licenses"
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
                        className="w-full"
                        style={{ backgroundColor: 'black', border: 'none' }}
                        onClick={handleSearch}
                    />
                </div>
            </div>
        </div>
    );
}

export default MainPage;
